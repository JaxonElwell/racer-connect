import Database from 'better-sqlite3';

const db = new Database('student_orgs.db')

function insertStudentOrganization(name, category, president, president_email, advisor, advisor_email) {
    const sql = `
        INSERT INTO StudentOrganizations (name, category, president, president_email, advisor, advisor_email)
        VALUES (?, ?, ?, ?, ?, ?)
    `
    db.prepare(sql).run(name, category, president, president_email, advisor, advisor_email)
}

function removeStudentOrganization(id) {
    const sql = `
        DELETE FROM StudentOrganizations
        WHERE id=?
    `
    db.prepare(sql).run(id)
}

function getOrganizations() {
    const sql = `
        SELECT * FROM StudentOrganizations
    `
    const rows = db.prepare(sql).all()
    return rows
}

function getOrganization(id) {
    const sql = `
        SELECT * FROM StudentOrganizations
        WHERE id = ?
    `
    const row = db.prepare(sql).get(id)
    return row
}

console.log(getOrganization(7))