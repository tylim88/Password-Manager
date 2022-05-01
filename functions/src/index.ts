import 'regenerator-runtime/runtime' // https://stackoverflow.com/a/51650116/5338829
import { exp } from 'firecall'
import * as api from 'api'

exp(api).forEach(item => {
	const { name, onCall } = item
	exports[name] = onCall
})
