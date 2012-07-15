var test = require("testling")
    , testServer = require("test-server")
    , routilStatic = require("..")
    , $static = routilStatic({
        uri: __dirname
    })
    , router = new require("routes").Router()

router.addRoute("/*", $static)

testServer(handleRequest, startTests)

function handleRequest(req, res) {
    var route = router.match(req.url)

    route.fn(req, res, route.params, route.splats)
}

function startTests(request, done) {
    test("getting file works", function (t) {
        request("/test.js", function (err, res, body) {
            t.equal(err, null, "error is not null")

            t.equal(res.headers["content-type"], "text/javascript")
            t.ok(res.headers.etag)

            t.ok(body.indexOf("var $static = routilStatic"))

            t.end()
        })
    })

    .on("end", done)
}