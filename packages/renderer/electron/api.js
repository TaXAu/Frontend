import {router} from '../src/router';

// change current route use menu buttons
window.electronAPI.changeRouteFromMenu((event,route)=> router.push(route));
