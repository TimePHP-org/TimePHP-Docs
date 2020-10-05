# Repository

Repositories can make very simple query using `Entity`, but also complex queries using : 
- Pseudo-native query
- Native query

**Pseudo-native query** look like this :
```php
$user = Manager::table('User')->where('name', 'John')->first();
```
While **native query** look like this : 

```php
$user = Manager::select("SELECT * FROM User WHERE name = ?", ['John']);
```
They are both equivalent to : 
```sql
SELECT * FROM User WHERE name = 'John';
```

The difference between those two queries is that, **pseudo-native queries** return an `entity` while **native queries** return an `array`.