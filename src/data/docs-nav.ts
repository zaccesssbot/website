import { SECTIONS, GROUPS, PAGES, SOURCES } from "../../scripts/docs-manifest.mjs";

// the sidebar, built from the manifest the sync script reads, so the order of the pages and the
// sections is decided in one place. A page the sync skipped (a file not written yet) is left out
export interface NavLink { href: string; label: string; children?: NavLink[] }
export interface NavSection { id: string; title: string; summary: string; links: NavLink[] }

export const DOCS_HOME = "/docs/";
export const hrefFor = (slug: string) => `${DOCS_HOME}${slug}/`;

export { SECTIONS, GROUPS, PAGES, SOURCES };

/** titles come from the synced pages, keyed by slug */
export function docsNav(titles: Map<string, string>): NavSection[] {
  const link = (slug: string): NavLink | null => {
    const label = titles.get(slug);
    return label ? { href: hrefFor(slug), label } : null;
  };
  return SECTIONS.map((section) => {
    let links: NavLink[];
    if (section.id === "use") {
      links = GROUPS.map((group) => ({
        href: hrefFor(group.id),
        label: group.title,
        children: PAGES.filter((p) => p.section === "use" && p.group === group.id).map((p) => link(p.slug)).filter((l): l is NavLink => l !== null),
      }));
    } else {
      links = PAGES.filter((p) => p.section === section.id).map((p) => link(p.slug)).filter((l): l is NavLink => l !== null);
    }
    return { id: section.id, title: section.title, summary: section.summary, links };
  });
}
