from fastapi import FastAPI
from pydantic import BaseModel
from datetime import date

# Server creation
app = FastAPI()



#Classes for Temp DB
class User(BaseModel):
    id: int
    name: str
    age: int
    city: str

# Temp DB stprage
users = []

# Server created paths/routes

# GET ALL USERS
@app.get("/users")
def get_users():
    return users


# POST 
@app.post("/createUser")
def create_user(user: User):
    users.append(user)
    return {
        "message": "User created successfully",
        "user": user
    }


#PUT
@app.put("/users/{user_id}")
def updateUser(user_id: int, user: User):

    for index, _user in enumerate(users):

        if _user.id == user_id:
            users[index] = user

            return {
                "message": "User updated successfully",
                "user": user
            }

    return {
        "message": "User not found"
    }