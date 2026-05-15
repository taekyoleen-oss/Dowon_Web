import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAdminEmail } from "@/lib/admin/auth";
import { buildBriefDocx } from "@/lib/legal-briefs/docx-builder";
import { getBriefSkill } from "@/lib/legal-briefs/skills";

export const runtime = "nodejs";

const sectionSchema = z.object({
  title: z.string(),
  body: z.string(),
});

const flagSchema = z.object({
  label: z.string(),
  detail: z.string(),
});

const bodySchema = z.object({
  skillSlug: z.string(),
  documentTitle: z.string(),
  sections: z.array(sectionSchema).min(1),
  flags: z.array(flagSchema).optional(),
  appendix: z.object({ title: z.string(), body: z.string() }).optional(),
});

export async function POST(req: Request) {
  if (!getCurrentAdminEmail()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid request", details: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }

  const skill = getBriefSkill(body.skillSlug);
  if (!skill) {
    return NextResponse.json({ error: "Unknown skill" }, { status: 404 });
  }

  const buf = await buildBriefDocx({
    skillName: skill.name,
    documentTitle: body.documentTitle,
    sections: body.sections,
    appendix: body.appendix,
    flags: body.flags,
  });

  const filename = `${skill.name}_${Date.now()}.docx`;
  // RFC 5987 — Korean filename safe across browsers.
  const encoded = encodeURIComponent(filename);

  // NextResponse expects BodyInit — convert Buffer to a fresh Uint8Array view.
  const bytes = new Uint8Array(buf);
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="brief.docx"; filename*=UTF-8''${encoded}`,
      "Content-Length": String(bytes.byteLength),
    },
  });
}
