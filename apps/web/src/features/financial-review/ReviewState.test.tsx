import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { StateMessage } from "./FinancialReviewPage";

test("missing assessment state offers assessment and example routes", () => {
  const html = renderToStaticMarkup(
    <StateMessage
      title="No financial assessment was found"
      message="Complete the short assessment first, or view the example review."
    />,
  );
  expect(html).toContain("No financial assessment was found");
  expect(html).toContain('href="/assessment"');
  expect(html).toContain('href="/review/demo"');
});
