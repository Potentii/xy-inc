import winston from 'winston'



const env = process.env.NODE_ENV;



const logger = winston.createLogger({
   level: setLevel(env),
   format: winston.format.json(),
   defaultMeta: { service: 'api-log' },
   exitOnError: false,
   transports: setTransports(env)
});



function setLevel(env){
   switch(env){
   case 'production':  return 'error';
   default:            return 'debug';
   }
}



function setTransports(env){
   switch(env){
   case 'production':
      return [
         new winston.transports.Console({ format: winston.format.prettyPrint() })
      ];
   default:
      return [
         new winston.transports.Console({ format: winston.format.prettyPrint() })
      ];
   }
}



export default logger;
