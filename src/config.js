
import {Vector3} from 'three'

export let world = {
	x : new Vector3(1,0,0),
	y : new Vector3(0,1,0),
	z : new Vector3(0,0,1)
}

export let levels = [
	{
		label  : 'FullYear',
		spread : .000001,
		arch   : .000001,
		flip   : 0, 
		scale  : 7, 
		ms     : 31540000000
	},{
		label  : 'Month', 
		radius : 21175,
		flip   : 0,
		scale  : 1,
		ms     : 2628000000,
		format : [
			'Januar', 'Februar', 'March', 'April', 
			'Mai', 'June', 'July', 'August', 
			'September', 'October', 'November', 'December'
		]
	},{
		label  : 'Date', 
		radius : 6652, 
		flip   : 1, 
		scale  : .3, 
		ms     : 86400000,
		format : [
			'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
			'Thursday', 'Friday', 'Saturday'
		] 
	},{
		label  : 'Hours', 
		radius : 1741, 
		flip   : 1,
		scale  : .05, 
		ms     : 3600000
	},{
		label  : 'Minutes', 
		radius : 364, 
		flip   : 1, 
		scale  : .01, 
		ms     : 60000
	},{
		label  : 'Seconds', 
		radius : 95, 
		flip   : 1,
		scale  : .002, 
		ms	   : 1000
	}
]

// add dynamic variables
levels.forEach(level => {
	let dynamic = {
	// time
		size     : 0, // ms
		flat     : 0, // ms
		loop     : false, // bool
	// space
		up       : world.y, // 3d vector
		forward  : world.z, // 3d vector
		position : new Vector3(0,0,0), // 3d vector
		arch     : 0, // in radians
	// cache
		points   : [] // points
	}
	for (let i in dynamic) 
		if (!level[i]) level[i] = dynamic[i]
})

