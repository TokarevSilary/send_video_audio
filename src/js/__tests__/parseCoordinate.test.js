import { TimelineControl } from "../TimelineControl";

const page = new TimelineControl(null, null);

test.each([
  ["есть пробел", "51.50851, −0.12572"],
  ["пробела", "51.50851,−0.12572"],
  ["есть квадратные скобки", "[51.50851, −0.12572]"],
])("%s test", (testName, coordinate) => {
  const result = page.parseCoordinate(coordinate);
  expect(result[1]).toBe("51.50851");
  expect(result[2]).toBe("−0.12572");
});

test("Не подходящий формат", () => {
  // const result = page.parseCoordinate("l51.50851, −0.12572");
  expect(() => page.parseCoordinate("l51.50851, −0.12572")).toThrow(
    "Could not parse coordinate",
  );
});
