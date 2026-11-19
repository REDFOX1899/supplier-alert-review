# Hackathon specification

## Shared inputs

- An order CSV with order ID, vendor, product description, and optional product code, manufacturer, facility, production area, material origin, and import date. Preserve blanks as unknown.
- Reviewed notice records with a source URL, cited passage, notice type, effective date, explicit link to any notice they update, and applicable entity, product, material, and geographic scope. Capture which date and origin facts each notice uses.
- One sourced supplier relationship if accessible through the event's partner tools. Capture the parties, relationship type, date, and source reference.

## Matching

Resolve supplier identities with provider identifiers or analyst confirmation. Evaluate each applicable notice using its reviewed scope and the relevant dates. Surface orders as **Review**, **Evidence needed**, or **Outside this notice's scope** with the exact reason and citation. A missing required fact produces a targeted request. For example, ask for the cotton's origin when the order only identifies the garment's assembly location.

Use two historical cases to check the design. The glove example uses a named manufacturer, product, and country. The cotton example uses a material and production region and should use a historical review date. [CBP historical cotton ruling](https://rulings.cbp.gov/ruling/H330077)

## Review screen

| Interaction | Expected behavior |
| --- | --- |
| Set review date to April 2021 | The matched glove example shows the March finding and its source. |
| Move the review date past September 10, 2021 | The review shows the September determination. The order's import date remains visible because the determination describes which imports it covers. |
| Open the distributor-only glove order | Show the manufacturer as unknown and surface the request for manufacturer and facility. A historical trade relationship may support investigation. Lot evidence is required to confirm the manufacturer of the order. |
| Open the different-product example | Explain that the selected historical finding has a different product scope. |

The interface supports analyst review. Show the scope of the specific notices and preserve unknown fields through the workflow.

## Integration

Use Tavily Search and Extract on the server to retrieve official notice content. Keep the two reviewed notice records available as a labeled demo fallback. Use Sayari for legal entity identity and Tradeverifyd for supplier relationships where event access permits. Each review status should be reproducible from the case records and order fields.
