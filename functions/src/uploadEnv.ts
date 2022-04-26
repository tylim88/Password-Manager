// https://medium.com/@AllanHasegawa/setting-config-for-firebase-cloud-functions-with-json-136f455e7c69
import * as childProcess from 'child_process'
// https://stackoverflow.com/questions/60205891/import-json-extension-in-es6-node-js-throws-an-error
// https://stackoverflow.com/questions/70106880/err-import-assertion-type-missing-for-import-of-json-file
import j from '../env.json'

const spawn = childProcess.spawn

// env var vessel
const ENV: ENV = j

const strings = (Object.keys(ENV) as Array<keyof typeof ENV>).reduce(
	(acc, key) => {
		const value = (
			Object.keys(ENV[key]) as Array<keyof typeof ENV[typeof key]>
		).reduce((acc2, key2) => {
			acc2.push(`${key}.${key2}="${ENV.env[key2]}"`)
			return acc2
		}, [] as string[])
		return acc.concat(value)
	},
	[] as string[]
)

const runFirebaseConfigSet = (properties: string[]) => {
	return new Promise(resolve => {
		const args = ['functions:config:set'].concat(properties)
		const cmd = spawn('firebase', args, { shell: true })
		cmd.stdout.setEncoding('utf8')
		cmd.stdout.on('data', data => {
			console.log(data)
		})
		cmd.stderr.on('data', () => {
			console.log('Error:', cmd.stderr.toString())
		})
		cmd.on('close', code => {
			console.log(`Exit code: ${code}`)
			resolve(code)
		})
	})
}
runFirebaseConfigSet(strings)
