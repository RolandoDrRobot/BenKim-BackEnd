const createUser = async (user: any, usersDB:any) => {
  try {
    const newUser = await usersDB.doc(user.id).get();
    if (!newUser.exists) {
      usersDB.doc(user.id).set({
        id: user.id,
        displayName: user.displayName,
        provider: user.provider,
        email: user.email,
        language: user.language
      });
    }
  }
  catch (e) {
    console.log(e);
  }
}

export { createUser };
