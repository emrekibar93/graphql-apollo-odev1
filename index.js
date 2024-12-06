const { ApolloServer, gql } = require('apollo-server');
const {authors,books} = require("./data")
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

const typeDefs = gql`
type Participants {
  id: ID
  user_id: ID
  event_id: ID
  username: String
}

type Users {
  id: ID
  username: String
  email: String
  events:[Events]
}

type Locations {
  id: ID
  name: String
  desc: String
  lat: Float
  lng: Float
}

type Events {
  id: ID
  title: String
  desc: String
  date: String
  from: String
  to: String
  location_id: ID
  user_id: ID
  user: Users
  location: Locations
  participants : [Participants]
}

type Query{
participants : [Participants]
users : [Users]
locations :[Locations]
events : [Events]
user(id:ID): Users
event(id:ID): Events

}
`

const resolvers = {
    Query:{
    participants: () => data.participants,
    users: () => data.users,
    locations: () => data.locations,
    events: () => data.events,
    user :(parent,args) =>{
        
        const datas = data.users.find((user)=>(user.id)==args.id);
        return datas 
    },
    event :(parent,args) =>{
        
        const datas = data.events.find((event)=>(event.id)==args.id);
        return datas 
    }
    },
    Users :{
        events:(parent,args) => {      
                return data.events.filter((event)=>event.user_id==parent.id)
        }

    },
    Events :{
        user: (parent,args) => {
                return data.users.find((user)=>user.id==parent.user_id)
        },
        location :(parent,args) => {
            return data.locations.find((location)=>location.id==parent.location_id)
        },
        participants :(parent,args) => { 
            return data.participants.filter((part)=>part.event_id==parent.id)
       }
    },
    Participants :{
        username:(parent,args) => {      
                const user = data.users.find((user)=>user.id==parent.user_id)
                return user.username
        }

    },

};

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => console.log(`Apollo Server is Up at ${url}`));