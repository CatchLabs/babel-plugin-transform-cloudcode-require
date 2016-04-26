const path = require('path');

module.exports = function () {
    return {
        visitor: {
            CallExpression: function CallExpression(_path) {
                var callee = _path.node.callee;

                var modulePath = _path.node.arguments[0];
                var calleeIsRequire = callee.type == 'Identifier' && callee.name == 'require';

                var isRelativeModulePath = modulePath && modulePath.type == 'StringLiteral' && modulePath.value.indexOf('.') === 0;

                if (calleeIsRequire && isRelativeModulePath) {
                    var fromPath = _path.hub.file.log.filename.split(path.win32.sep).join(path.posix.sep);
                    var targetPath = modulePath.value;
                    var relativePath = path.posix.resolve(path.dirname(fromPath), targetPath);
                    console.log({fromPath, targetPath, relativePath});
                    modulePath.value = relativePath;
                }
            }
        }
    };
};