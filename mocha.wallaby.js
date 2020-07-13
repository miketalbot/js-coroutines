module.exports = function (wallaby) {

    return {
        files: [
            'src/component/**/*.+(js|jsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
            {pattern: '**/*.js', instrument: false},
            'docker-compose.yml',
            '*.env',
            '!**/*.test.js',
            '!node_modules/**/*',
        ],

        tests: ['src/test/**/*.test.js?(x)'],

        env: {
            type: 'node',
            runner: 'node',
        },
        compilers: {
            '**/*.js': wallaby.compilers.babel({
                presets: ['react-app']
            })
        },
        testFramework: 'mocha',
    };
};
