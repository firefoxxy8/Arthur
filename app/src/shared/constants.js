const toHashMap = (values) => {
	return values.reduce((map, value) => {
		map[value] = value;
		return map;
	}, {});
};

export const PLATFORM = toHashMap([
	"LINUX",
	"MACOS",
	"OTHER",
	"WINDOWS",
]);
