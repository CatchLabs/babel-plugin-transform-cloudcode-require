const path = require('path');
const projectRoot = path.resolve(path.dirname(__filename), '../..');

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
                    var cloudModulePath = path.posix.join(path.posix.dirname(fromPath), targetPath).split(path.posix.sep);;
                    cloudModulePath.splice(0, 1, 'cloud');
                    cloudModulePath = cloudModulePath.join(path.posix.sep);
                    console.log(JSON.stringify({fromPath, targetPath, cloudModulePath}));
                    modulePath.value = cloudModulePath;
                }
            }
        }
    };

};