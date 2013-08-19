var config = module.exports;

config["Diamonds tests"] = {
	environment: "browser",
	rootPath: "../",
	libs: [
		"test/jquery.js"
	],
	sources: [
		"src/**/*.js"
	],
	tests: [
		"test/**/*-test.js"
	]
};
