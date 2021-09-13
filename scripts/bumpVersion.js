const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const semver = require('semver');
const { exit } = require('process');


const branch = execSync('git branch --show-current').toString()

if (!/main/.test(branch)) {
    exit(1)
}

const updateAble = [
    'server',
    'client'
]

const versionPaths = {
    'server': ['..', 'src', 'version.ts'],
    'client': ['..', 'static', 'ts', 'version.ts']
}

const regexArray = updateAble.map(s => new RegExp('^' + s + '\\:(.*)$'))

const updates = {}

for (const arg of process.argv) {
    for (let i = 0; i < updateAble.length; i++) {
        const match = regexArray[i].exec(arg)
        if (match) {
            updates[updateAble[i]] = match[1]
        }
    }
}


console.log('Bumping Versions:')
Object.entries(updates).forEach(([module, update]) => {
    console.log(module + ':', update)
})


for (const module of updateAble) {
    if (!(module in updates)) {
        continue
    }
    const modulePath = path.join(__dirname, ...versionPaths[module])
    console.log('update', module)

    const version = fs.readFileSync(modulePath).toString()
    const extractedVersion = version.split('\'')[1]

    console.log('found:', extractedVersion)
    const newVersion = semver.inc(extractedVersion, updates[module])

    console.log('bumped:', module, newVersion)

    updates[module] = newVersion

    fs.writeFileSync(modulePath, 'export const ' + module.toUpperCase() + '_VERSION = \'' + newVersion + '\';\n')
}

(async () => {
    console.log('building...')
    await exec('yarn build')
    console.log('git commit...')
    await exec('git add static/js dist')
    await exec('git commit -m \'release versions: ' + Object.entries(updates).map(([module, ver]) => module + '@' + ver).join(' ') + '\'')
    console.log('pushing to github...')
    await exec('git push')
    console.log('pushing to heroku...')
    await exec('yarn publish:heroku')
    console.log('done!')
})()
