
import '../graphic/style.sass'
import {controls, scene, camera, loop} from './render'
import {Vector3} from 'three'
import config, {levels, world} from './config'
import * as point from './point'
import * as time from './time'
import * as space from './space'
import * as travel from './travel'
import * as graph from './graph'
import './hover'

// TODO: https://gamedevelopment.tutsplus.com/tutorials/quick-tip-how-to-render-to-a-texture-in-threejs--cms-25686

let camCtrl = {
	target   : new Vector3(),
	position : new Vector3(),
	up		 : new Vector3()
}

let calc = (pick, depth) => {
	let addPointToGraph = graph.make(levels[depth], pick.getTime())
	travel.doDepth(pick, depth, (p, current) => {
		if (p.time.depth == depth && p.opacity > 0) addPointToGraph(p)
		if (current) {
			camCtrl.up       = p.space.y.clone()
			camCtrl.target   = p.space.p.clone()
			camCtrl.position = p.space.z.clone()
				.add(p.space.y.clone().multiplyScalar(.25))
				.add(p.space.x.clone().multiplyScalar(-.15))
				.multiplyScalar(levels[Math.max(depth, 1)].radius * 2.5)
				.add(p.space.p)
		}
	})
}

let pick = new Date(2010,6,1,0,0,0,0)

if (1)
	calc(pick, config.depth)
else if (0)
	setInterval(() => {
		pick  = new Date()
		calc(pick, config.depth)
	}, 1000)

document.addEventListener('keypress', e => {
	if (e.key == 'w' || e.key == 's') {
		config.depth +=
			e.key == 'w' && config.depth < levels.length - 1? 1: 
			e.key == 's' && config.depth > 0? -1: 0
		calc(pick, config.depth)
	} else if (e.key == 'a' || e.key == 'd') {
		let next = time[e.key == 'd'? 'next':'prev']
			(pick, Math.max(config.depth-1, 0))
		calc(next, config.depth)
		pick = next
	}
	e.preventDefault()
})

loop(() => {
	// automatic camera movement
	let speed = config.camSpeed
	if (1 && camCtrl.target.distanceTo(controls.target) > 0.01) {
		controls.target
			.add(camCtrl.target.clone()
				.sub(controls.target)
				.multiplyScalar(speed))
		let pos = camera.position.clone()
			.add(camCtrl.position.clone()
				.sub(camera.position)
				.multiplyScalar(speed))
		camera.position.set(pos.x, pos.y, pos.z)
		// let up = camera.up.clone()
		// 	.add(camCtrl.up.clone()
		// 		.sub(camera.up)
		// 		.multiplyScalar(speed))
		// camera.up.set(up.x, up.y, up.z)
	}
	// calculate camera local axis
	let up = new Vector3(0,1,0).applyQuaternion(camera.quaternion)
	// bildboard
	levels.forEach((level, i) => {
		graph.updateOpacity(level, config.depth)
		for (let i in level.points) {
			let p = level.points[i]
			p.animateOpacity()
			if (p.isVisible) {
				p.lookAt(camera.position.clone(), up)
				p.debug(config.debug)
			}
		}
	})
})
