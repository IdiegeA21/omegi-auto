import fs from "node:fs";
import path from "node:path";
import raw from "@/data/instagram.json";

export type IgTile = { id: string; image: string | null; caption: string };
const EXT = ["webp", "avif", "jpg", "jpeg", "png"];
const auto = (id: string) => { for (const e of EXT) if (fs.existsSync(path.join(process.cwd(), "public", "instagram", `${id}.${e}`))) return `/instagram/${id}.${e}`; return null; };

/** SERVER ONLY. Uses image from instagram.json, or public/instagram/<id>.(webp|jpg|png) when the file exists. */
export const getInstagram = (): IgTile[] => (raw as IgTile[]).map((t) => ({ ...t, image: t.image ?? auto(t.id) }));
