const rewire = require("rewire")
const time_off_request_api = rewire("./time-off-request-api")
const renderPage = time_off_request_api.__get__("renderPage")
// @ponicode
describe("renderPage", () => {
    test("0", () => {
        let result = renderPage()
        expect(result).toMatchSnapshot()
    })
})
