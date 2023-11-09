import { useEffect } from 'react';
export default function useKeys (key , action) {
     useEffect(() => {
       function callBack(event) {
         if (event.code ===  key) {
           action();
         }
       }
       document.addEventListener('keydown', callBack);

       return function () {
         document.removeEventListener('keydown', callBack);
       };
     }, [action  , key]);
}