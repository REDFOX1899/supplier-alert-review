# Hackathon specification

## Inputs

- Three sample purchase orders with order ID, vendor, product, production country when known, manufacturer when known, and an import date when available.
- The March 29 and September 10, 2021 CBP notices linked in the README. Record source URL, effective date, the cited passage, named manufacturer, and product and location scope.
- One sourced supplier relationship if accessible through the event's partner tools. Capture the parties, relationship type, date, and source reference.

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
