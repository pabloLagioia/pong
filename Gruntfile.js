module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            dev: {
                options: {
                    compress: false,
                    sourceMap: true,
                    banner:"/* \n CSS GENERATED FROM LESS FILES \n CHANGES HERE WILL BE LOST \n WORK ON LESS FILES*/"
                },
                files: {
                    'public/styles.css': 'src/less/style.less'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
};
