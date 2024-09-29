var mssql = require('mssql');
var displayHandler = require('./displayhandler');
var connection = require('./config');

module.exports = {
    getAllStudents: function(req, res) {
        var self = this;
        self.tableRows = ``;

        var request = new mssql.Request(connection);
        request.stream = true;
        request.query("SELECT * FROM Students");

        request.on('row', function (row) {
            self.tableRows += ` <tr>
                <td>${row.FirstName} </td>
                <td>${row.LastName}</td>
                <td>${row.Id_Group}</td>
                <td>${row.Term}</td>
                <td><span class="glyphicon glyphicon-pencil edit" style="cursor: pointer" id="${row.Id}"> &nbsp; </span>
                <span class="glyphicon glyphicon-remove delete" style="cursor: pointer" id="${row.Id}"> &nbsp; </span></td>
            </tr>`;
        });
        request.on('done', function (affected) {
            res.render('index', { data: self.tableRows, buttons: true });
        });
    },

	insertStudent: function(data, req, res) {
		const inserts = {
			FirstName: data.FirstName,
			LastName: data.LastName,
			Id_Group: data.Id_Group,
			Term: data.Term
		};
	
		if (!inserts.FirstName || !inserts.LastName || !inserts.Id_Group || !inserts.Term) {
			return res.status(400).send('Fields can\'t be empty');
		}
	
		const transaction = new mssql.Transaction(connection);
		
		transaction.begin(function (err) {
			if (err) {
				console.log('Transaction begin error:', err);
				return res.status(500).send('Transaction begin error');
			}
	
			const request = new mssql.Request(transaction);
			request.input('FirstName', mssql.NVarChar, inserts.FirstName);
			request.input('LastName', mssql.NVarChar, inserts.LastName);
			request.input('Id_Group', mssql.Int, inserts.Id_Group);
			request.input('Term', mssql.NVarChar, inserts.Term); 
	
			request.query("INSERT INTO Students (FirstName, LastName, Id_Group, Term) VALUES (@FirstName, @LastName, @Id_Group, @Term)", function (err, result) {
				if (err) {
					console.log(err);
					transaction.rollback(function (err) {
						console.log('rollback successful');
					});
				} else {
					transaction.commit(function (err, data) {
							console.log('data commit success');
							res.send('transaction successful');
					});
				};
			});
		});
	},
	
	
    loadStudentById: function(req, res) {
        var inserts = { id: parseInt(req.params.id) };

        var ps = new mssql.PreparedStatement(connection);
        ps.input('id', mssql.Int);

        ps.prepare('SELECT * FROM Students WHERE Id=@id', function (err) {
            ps.execute(inserts, function (err, rows) {
                if (err) console.log(err);
                var row = rows.recordset[0];
                res.render('edit_item_page', {
                    id: row.Id,
                    FirstName: row.FirstName,
                    LastName: row.LastName,
                    Id_Group: row.Id_Group,
                    Term: row.Term
                });
                ps.unprepare();
            });
        });
    },

    updateStudent: function(req, res) {
		const { id, FirstName, LastName, Id_Group, Term } = req.body;
	
		var ps = new mssql.PreparedStatement(connection);
		ps.input('id', mssql.Int);
		ps.input('FirstName', mssql.NVarChar);
		ps.input('LastName', mssql.NVarChar);
		ps.input('Id_Group', mssql.Int);
		ps.input('Term', mssql.NVarChar);
	
		ps.prepare('UPDATE Students SET FirstName = @FirstName, LastName = @LastName, Id_Group = @Id_Group, Term = @Term WHERE Id = @id', function(err) {
			if (err) {
				console.log(err);
				return res.status(500).send(err.message);
			}
	
			ps.execute({ id: parseInt(id), FirstName, LastName, Id_Group: parseInt(Id_Group), Term }, function(err) {
				ps.unprepare();
				if (err) {
					console.log(err);
					return res.status(500).send(err.message);
				}
	
				res.send('OK');
			});
		});
	},
	
    deleteStudent: function (req, res) {
        var inserts = { id: parseInt(req.params.id) };

        var ps = new mssql.PreparedStatement(connection);
        ps.input('id', mssql.Int);

        ps.prepare('DELETE FROM Students WHERE Id=@id', function (err) {
            if (err) console.log(err);
            ps.execute(inserts, function (err) {
                if (err) console.log(err);
                ps.unprepare();
                res.send('OK');
            });
        });
    }
}
