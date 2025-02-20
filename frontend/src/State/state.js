import {proxy} from 'valtio'
 
const state = proxy({
    currentUser: null,
    activeIndex: 0,
    categories:[],
    users:[],
    items:[]
})

export default state