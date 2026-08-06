# Task: Show user's rooms in "Your rooms" after sign-in and make room creation work

## Steps
- [x] 1. Add `fetchRoomsByHost(hostId)` and `subscribeToRoomsByHost(hostId, cb)` to `studyService.ts`
- [x] 2. Update `App.tsx` to add `myRooms` state, load it on sign-in, and update on room creation
- [x] 3. Update `StudyHubDashboard.tsx` to display `myRooms` in "Your rooms"
- [x] 4. Update `ProfileDashboard.tsx` to display `myRooms` in "Your rooms"
- [x] 5. Verify with build/dev server
