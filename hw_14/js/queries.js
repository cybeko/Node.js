var mssql = require('mssql');
var connection = require('./config');

module.exports = {
    tableRows: '',

    getAllItems: function(req, res) {
        var self = this;
        self.tableRows = ``;

        var request = new mssql.Request(connection);
        request.stream = true;
        request.query("SELECT * FROM items");

        request.on('row', function(row) {
            self.tableRows += req.url === '/' ? `
                <tr>
                    <td>${row.name}</td>
                    <td>${row.description}</td>
                    <td>${row.completed ? 'yes' : 'no'}</td>
                </tr>` : `
                <tr>
                    <td>
                        <span class="glyphicon glyphicon-pencil edit" style="cursor: pointer" id="${row.id}"></span> 
                        <span class="glyphicon glyphicon-remove delete" style="cursor: pointer" id="${row.id}"></span>
                        ${row.name}
                    </td>
                    <td>${row.description}</td>
                    <td>${row.completed ? 'yes' : 'no'}</td>
                </tr>`;
        });

        request.on('done', function() {
            var options = { edit: req.url !== '/' };
            res.render('index', { data: self.tableRows, buttons: options.edit });
        });
    },

    insertItem: function(data, req, res) {
        var inserts = { name: data.name, description: data.description, completed: parseInt(data.completed) };
        var ps = new mssql.PreparedStatement(connection);

        ps.input('name', mssql.Text);
        ps.input('description', mssql.Text);
        ps.input('completed', mssql.Int);

        ps.prepare("INSERT INTO items (name, description, completed) VALUES (@name, @description, @completed)", function(err) {
            if (err) console.log(err);
            ps.execute(inserts, function(err) {
                if (err) console.log(err);
                ps.unprepare();
            });
        });
    },

    loadItemById: function(req, res) {
        var inserts = { id: parseInt(req.params.id) };
        var ps = new mssql.PreparedStatement(connection);

        ps.input('id', mssql.Int);
        ps.prepare('SELECT * FROM items WHERE id=@id', function(err) {
            ps.execute(inserts, function(err, rows) {
                if (err) console.log(err);
                var row = rows.recordset[0];
                res.render('edit_item_page', {
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    completed: row.completed
                });
                ps.unprepare();
            });
        });
    },

    updateItem: function(req, res) {
        var inserts = { id: parseInt(req.body.id), name: req.body.name, description: req.body.description, completed: parseInt(req.body.completed) };
        var ps = new mssql.PreparedStatement(connection);

        ps.input('id', mssql.Int);
        ps.input('name', mssql.Text);
        ps.input('description', mssql.Text);
        ps.input('completed', mssql.Int);

        ps.prepare("UPDATE items SET name=@name, description=@description, completed=@completed WHERE id=@id", function(err) {
            if (err) console.log(err);
            ps.execute(inserts, function(err) {
                if (err) console.log(err);
                ps.unprepare();
            });
        });
    },

    deleteItem: function(req, res) {
        var inserts = { id: parseInt(req.params.id) };
        var ps = new mssql.PreparedStatement(connection);

        ps.input('id', mssql.Int);
        ps.prepare('DELETE FROM items WHERE id=@id', function(err) {
            if (err) console.log(err);
            ps.execute(inserts, function(err) {
                if (err) console.log(err);
                ps.unprepare();
                res.send('OK');
            });
        });
    }
};
