const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports.name = "/api/group/logs";
module.exports.method = "GET";
module.exports.verify = function (req, res) {
    return !!req.user;
}

module.exports.execute = function (req, res) {
    if (req.body.id) {
        prisma.group.findUnique({
            where: {
                id: req.body.id
            },
            include: {
                users: {
                    select: {
                        id: true
                    }
                },
                logs: true
            }
        }).then((group) => {
            if (group.users.filter(e => e.id === req.user.id).length == 0) {
                res.status(401).json({ status: 401, error: "Unauthorized" });
            }
            else {
                res.json({ logs: group.logs });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Internal server error" })
        });
    } else {
        res.status(400).json({ error: `Invalid form` });
    }
}