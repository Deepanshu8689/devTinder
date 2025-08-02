# DevTinder Apis

## authRouter
 - Post /signup
 - Post /login
 - Post /logout

## profileRouter
 - Get / profile/view
 - Patch /profile/edit
 - Patch /profile/password

## connectionRequestrouter
 - Post /request/send/:status/:userID
 -    Post /request/send/interested/:userID
 -    Post /request/send/ignored/:userID

 - Post /request/review/:status/:requestID
 -    Post /request/review/accepted/:requestID
 -    Post /request/review/rejected/:requestID

## userRouter
 - Get /user/receivedRequest
 - Get /user/connections
 - Get /user/feed - Gets you the profile of other users on platform


 status -> ignored, interested, accepted, rejected