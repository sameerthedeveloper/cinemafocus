export default function LocationBreadcrumb() {
  return (
    <nav
      className="text-xs text-zinc-500 mb-4"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
        <a itemProp="item" href="https://cinemafocus.in">
          <span itemProp="name">Cinema Focus</span>
        </a>
        <meta itemProp="position" content="1" />
      </span>
      {" > "}
      <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
        <span itemProp="name">Chennai</span>
        <meta itemProp="position" content="2" />
      </span>
      {" > "}
      <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
        <span itemProp="name">Mylapore</span>
        <meta itemProp="position" content="3" />
      </span>
    </nav>
  );
}
