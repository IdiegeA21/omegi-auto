/** Site structure. Labels and hints use only what the business has said publicly. */
export type NavItem = { href: string; label: string; hint?: string };

export const primaryNav: NavItem[] = [
  { href: "/inventory", label: "Cars" },
  { href: "/pay-40", label: "Pay 40%" },
  { href: "/finder", label: "Car Finder" },
  { href: "/swap", label: "Swap" },
];

export const menuGroups: { title: string; items: NavItem[] }[] = [
  { title: "Buy", items: [
    { href: "/inventory", label: "Cars", hint: "The showroom" },
    { href: "/finder", label: "Car Finder", hint: "Three questions" },
    { href: "/shortlist", label: "Shortlist", hint: "Compare up to three" },
  ] },
  { title: "Pay", items: [
    { href: "/pay-40", label: "Pay 40%", hint: "Our offer" },
    { href: "/finance", label: "Finance estimator", hint: "Your 40% and the balance" },
  ] },
  { title: "Other ways to deal", items: [
    { href: "/swap", label: "Swap", hint: "Trade in your car" },
    { href: "/sell", label: "Sell your car" },
    { href: "/pre-order", label: "Pre-order", hint: "Import a car" },
    { href: "/delivery", label: "Nationwide delivery" },
  ] },
  { title: "Trust", items: [
    { href: "/sold", label: "Recently sold" },
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ] },
];

export const footerNav = {
  shop: [{ href: "/inventory", label: "Cars" }, { href: "/finder", label: "Car Finder" }, { href: "/shortlist", label: "Shortlist" }, { href: "/sold", label: "Recently sold" }],
  deal: [{ href: "/pay-40", label: "Pay 40%" }, { href: "/finance", label: "Finance estimator" }, { href: "/swap", label: "Swap" }, { href: "/sell", label: "Sell your car" }, { href: "/pre-order", label: "Pre-order" }, { href: "/delivery", label: "Nationwide delivery" }],
  company: [{ href: "/about", label: "About" }, { href: "/faq", label: "FAQ" }, { href: "/contact", label: "Contact" }, { href: "/privacy", label: "Privacy" }],
};

/** Every internal route the shell links to. Used by the stage placeholder so unbuilt pages don't 404 during review. */
export const knownRoutes = new Set<string>([
  ...primaryNav.map((n) => n.href),
  ...menuGroups.flatMap((g) => g.items.map((i) => i.href)),
  ...Object.values(footerNav).flat().map((i) => i.href),
]);
