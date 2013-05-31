var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "node", // or "node"
    sources: [
        "**/*.js"
    ],
    tests: [
        "test/*-test.js"
    ]
}