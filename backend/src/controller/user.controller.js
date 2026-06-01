import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
export async function getRecommendedUser(req,res) {
    try {
        const currentUserId=req.user.id;
        const currentUser=req.user;

        const recommendedUser=await User.find({
            $and:[
                {_id:{$ne: currentUserId}},//exclude current user
                  {_id:{$nin: currentUser.friends}},//exclude current user friends
                 { isOnboarded:true}
            ],
        });
        res.status(200).json(recommendedUser)
    } catch (error) {
        console.error('Error in getRecommendedUser controller',error.message);
        res.status(500).json({message:"internal server error"})
    }
}

export async function getMyFriends(req,res) {
    try {
        const user=await User.findById(req.user.id)
        .select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage");

        req.status(200).json(user.friends);
    } catch (error) {
      console.error('Error in getMyFriends controller',error.message);
        res.status(500).json({message:"internal server error"})
    }
    
}

export async function sendFriendRequest(req,res){
    try {
        const myId= req.user.id;
        const{id:recipientId}=req.params;

        //prevents sending request to yourself
        if(myId === recipientId){
             return res.status(400).json({message:"you can't send friend request to yourself"});
        }
      const recipient= await User.findById(recipientId);
        if(!recipient){
            return res.json(404).json({message:"Recipient not found"});
        }
        //check if user is already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"you are already friend with this user"});
        }

        //check if a request already exists
        const existingRequest=await FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:recipientId},
                {sender:recipientId,recipient:myId},
            ],
        });
        if(existingRequest){
            return res.status(400).json({message:"A friend request already exists between you and this user"});
        }
        const friendRequest=await FriendRequest.create({
            sender:myId, recipient:recipientId
        });
        res.status(201).json(friendRequest);

    } catch (error) {
        
    console.error("Error in sendFriendRequest controller",error.message)
    res.status(500).json({message:"Internal server error"}) ; 
}
}

export async function acceptFriendRequest(req,res){
try {
    const {id:requestId}=req.params;
    const friendRequest=await FriendRequest.findById(requestId);

    if(!friendRequest){
          return res.json(404).json({message:"friend request not found"});
    }
    //verify the current user is recipient
    if(friendRequest.recipient.toString()!== req.user.id){
         return res.json(403).json({message:"you are not authorized to accept this request"});
    }

    friendRequest.status="accepted";
    await friendRequest.save();

    //add each users to other friends array
    //$addToSet:adds elements to the array only if do not already exist

    await User.findByIdAndUpdate(friendRequest.sender ,{
        $addTOSet:{friends:friendRequest.recipient},
    })

       await User.findByIdAndUpdate(friendRequest.recipient ,{
        $addTOSet:{friends:friendRequest.sender},
    })
        res.status(200).json({message:"friend request accepted"});
} catch (error) {
      console.error("Error in acceptFriendRequest controller",error.message)
    res.status(500).json({message:"Internal server error"}) ; 
}

}

export async function getFriendRequests(req,res){
    try {
        const incommingReqs=await FriendRequest.find({
            recipient:req.user.id,
          status:"pending"        
        .populate("sender","fullName profilePic nativeLanguage learningLanguage")
        });

          const acceptedReqs=await FriendRequest.find({
            sender:req.user.id,
          status:"accepted"        
        .populate("recipient","fullName profilePic ")

    
        });
         res.status(200).json({incommingReqs,acceptedReqs})
    } catch (error) {
           console.error("Error in getpendingFriendRequest controller",error.message)
    res.status(500).json({message:"Internal server error"}) ; 
    }
}

export async function getOutgoingFriendReqs(req,res){
  try {
   const outgoingReqs=await FriendRequest.find({
           sender:req.user.id,
          status:"pending"        
        .populate("recipient","fullName profilePic nativeLanguage learningLanguage")
        });
              res.status(200).json(outgoingReqs);
  } catch (error) {
         console.error("Error in getoutgoingFriendRequest controller",error.message)
    res.status(500).json({message:"Internal server error"}) ; 
  }
}