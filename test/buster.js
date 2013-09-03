var config = module.exports;

config["Diamonds tests"] = {
	environment: "browser",
	rootPath: "../",
	libs: [
		"test/jquery.js",
		// "test/zepto.js"
	],
	sources: [
		"src/**/*.js"
	],
	resources: [
		{
			path: "diamonds.css",
			file: "src/diamonds.css"
		}
	],
	tests: [
		"test/**/*-test.js"
	]
};
