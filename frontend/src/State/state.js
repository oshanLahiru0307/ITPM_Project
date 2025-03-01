import {proxy} from 'valtio'
 
const state = proxy({
    currentUser: null,
    token: null,
    activeIndex: -1,
    categories:[],
    users:[],
    items:[],
    donations:[]
})

export default state