(function(){

   /* export public API */
   window.oboe = {
      doGet:   apiMethod('GET'),
      doDelete:apiMethod('DELETE'),
      doPost:  apiMethod('POST', true),
      doPut:   apiMethod('PUT', true)
   };
   
   function apiMethod(httpMethodName, mayHaveRequestBody) {
                  
      return function(firstArg){
       
         function start (url, body, callback){
            var 
               eventBus = pubSub(),
               fire = eventBus.fire,
               on = eventBus.on,
               clarinetParser = clarinet.parser(),
               rootJsonFn = incrementalContentBuilder(clarinetParser, fire, on);            
            
            streamingXhr(fire, on, httpMethodName, url, body );
                      
            return instanceController(clarinetParser, rootJsonFn, callback, fire, on);
         }
          
         if (isString(firstArg)) {
         
            // parameters specified as arguments
            //
            //  if (mayHaveContext == true) method signature is:
            //     .method( url, content, callback )
            //
            //  else it is:
            //     .method( url, callback )            
            //                                
            return start(   
                     firstArg,                                       // url
                     mayHaveRequestBody? arguments[1] : undefined,   // body
                     arguments[mayHaveRequestBody? 2 : 1] );         // callback
         } else {
         
            
            // method signature is:
            //    .method({url:u, body:b, complete:c})
            
            return start(   
                     firstArg.url,
                     firstArg.body,
                     firstArg.complete );
         }
                                                      
      };
   }   

})();