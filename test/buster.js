var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "node", // or "node"
    sources: [
        "src/*.js"
    ],
    tests: [
        "test/*-test.js"
    ]
}