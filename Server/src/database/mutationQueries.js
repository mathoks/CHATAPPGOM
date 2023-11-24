export const mutationsQueries = {
    createNew: `select * from addUsers($1, $2, $3,$4, $5,$6,$7,$8,$9)`,
    logIn: `select * from logusers($1)`,
    ratings_likes_main:  `select * from like_or_unliked($1, $2)`,
    main_chat: `select * from add_message($1, $2, $3)`
}