declare namespace Auth {
    type LoginEntity = Pick<User, 'username' | 'password'>
}
