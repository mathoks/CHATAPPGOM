// all database statements for each operation
export const queries = {
searchQuery: `select firstname, email, lastname, idx, username, CONCAT(firstname, ' ', lastname) as name, user_id, city_id ,cat_id, phone, total, about, createdat as CreatedAt, __typename, name as state, cityname from searchUu($1)`,
usersQuery : `select firstname, email, lastname, __typename, idx, username, CONCAT(firstname, ' ', lastname) as name, user_id, city_id ,cat_id, phone,  about, createdat as CreatedAt, total from fetchUsersTsp($1, $2, $3);`,
catQuery : `SELECT __typename, idx FROM gecati($1);`,
userQuery : `SELECT  firstname, email, lastname,cat_id, idx, username, CONCAT(firstname, ' ', lastname) as name, user_id, city_id ,createdat as CreatedAt,phone from geUser($1);`,

getcityQuery: `SELECT * from getcums($1);`,
getStateQuery: `SELECT statename,  stateid FROM prototype.states WHERE stateid IN ($1)`,

getStudQuery: `SELECT school, isIT, Department, levels, student_id FROM prototype.Student WHERE student_id IN ($1);`, 

getGradQuery: 
`SELECT grad_id, Graduate.nysc, Graduate.empStatus, Graduate.prefJob, Graduate.openJob,
Work.*, School.*, nStatus.*
FROM Graduate
LEFT JOIN Work ON Graduate.grad_id = Work.grads_id
LEFT JOIN nStatus ON Graduate.grad_id  = nStatus.status_id
LEFT JOIN School ON Graduate.grad_id = School.gradss_id
WHERE Graduate.grad_id IN ($1);`,


getWorkQuery: `SELECT BIN_TO_UUID(wrk_id) as wrk_id, BIN_TO_UUID(grads_id) as grads_id, company, EEnd, SStart, ddescription, roles from prototype.Work where grads_id in ($1)`,

getChatMain: `select idx, message, user_id, username, timestamp_line as timestamp from getmess()`
}