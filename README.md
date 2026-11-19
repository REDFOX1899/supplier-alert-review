# Trace Lithium

**NYU × Microsoft Ethical Tech Hackathon · Critical minerals & strategic supply security**

Can battery buyers verify where their lithium comes from and how it was produced? Compare three projects by water, regulatory oversight, and origin. Each review shows what a source supports and what evidence a buyer should request next. A live Tavily search discovers leads for extraction, refining, and recycling.

Run `npm start` with Node.js 22 or later and open [Trace Lithium](http://127.0.0.1:3000/). Copy `.env.example` to `.env` and set `TAVILY_API_KEY` for keyed search. Git ignores the local file.

The prototype uses three reviewed public sources. Search results are leads that require review. The next build step is to attach verified trade relationships between facilities and add dated monitoring or inspection records so a buyer can compare offers and spot a shared processor.

## Earlier prototype · Supplier Alert Review

**NYU × Microsoft Ethical Tech Hackathon · Forced labor & ethical sourcing**

Supplier Alert Review helps trade-compliance teams at importers and distributors apply dated government notices to the products they buy. Analysts upload open orders, see which ones need review, and get a specific evidence request when a supplier or origin is unknown. The initial coverage is U.S. forced-labor notices across product categories.

## Hackathon demo

Use a historical case involving certain disposable gloves produced in Malaysia by Top Glove. Start in April 2021 and move the review date past the September 10 determination. The app explains the status change for a sample order in scope and shows the government notice behind it. A distributor-only order with an unknown manufacturer prompts the analyst to request the manufacturer and production facility for the lot.

The demo will use three labeled sample orders and two real public notices. Any partner relationship shown in the demo needs a source and a date.

The glove case is the first demo. A historical cotton example will test the same workflow with a notice scoped to a material and region.

- [CBP finding, March 29, 2021](https://www.govinfo.gov/content/pkg/FR-2021-03-29/html/2021-06393.htm)
- [CBP determination, September 10, 2021](https://www.govinfo.gov/content/pkg/FR-2021-09-10/html/2021-19535.htm)

## Run the glove case

With Node.js 22 or later, run `npm start` and open [the glove demo](http://127.0.0.1:3000/gloves). No package installation is required.

Select **Verify with Tavily** to search for each notice and extract text from the official document. The app uses keyless access by default. To use redeemed credits, copy `.env.example` to `.env`, set `TAVILY_API_KEY`, and restart the app. The key stays on the local server and Git ignores `.env`.

## Project status

The glove case uses reviewed government records and fictional orders. The app reports live Tavily retrieval separately. See [the specification](SPECIFICATION.md) and [the backlog](BACKLOG.md) for partner data access and broader order intake.
