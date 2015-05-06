# The Dojo Toolkit Style Guide

## Code Conventions

1. All code naming conventions MUST be written in English.

### Naming

The following naming conventions MUST be used:

<table>
	<tr>
		<th>Construct</th><th>Convention</th>
	</tr>
	<tr>
		<td>package</td><td>lower-dash-case</td>
	</tr>
	<tr>
		<td>module exporting default class</td><td>UpperCamelCase</td>
	</tr>
	<tr>
		<td>all other modules</td><td>lowerCamelCase</td>
	</tr>
	<tr>
		<td>classes, interfaces, and type aliases</td><td>UpperCamelCase</td>
	</tr>
	<tr>
		<td>enums and enum value names</td><td>UpperCamelCase</td>
	</tr>
	<tr>
		<td>constants</td><td>UPPER_CASE_WITH_UNDERSCORES</td>
	</tr>
	<tr>
		<td>variables</td><td>lowerCamelCase or _lowerCamelCase</td>
	</tr>
	<tr>
		<td>parameters</td><td>lowerCamelCase or _lowerCamelCase</td>
	</tr>
	<tr>
		<td>public properties</td><td>lowerCamelCase</td>
	</tr>
	<tr>
		<td>protected/private properties</td><td>_lowerCamelCase</td>
	</tr>
</table>

<table>
	<tr>
		<th>Variable type</th><th>Convention</th>
	</tr>
	<tr>
		<td>Deferred</td><td>dfd</td>
	</tr>
	<tr>
		<td>Promise</td><td>promise</td>
	</tr>
	<tr>
		<td>Identifier</td><td>id</td>
	</tr>
	<tr>
		<td>Numeric iterator</td><td>i, j, k, l</td>
	</tr>
	<tr>
		<td>String iterator (for-in)</td><td>k, key</td>
	</tr>
	<tr>
		<td>Event</td><td>event</td>
	</tr>
	<tr>
		<td>Remover handle</td><td>handle</td>
	</tr>
	<tr>
		<td>Error object</td><td>error</td>
	</tr>
	<tr>
		<td>Keyword arguments object</td><td>kwArgs</td>
	</tr>
	<tr>
		<td>Origin, source, from</td><td>source</td>
	</tr>
	<tr>
		<td>Destination, target, to</td><td>target</td>
	</tr>
	<tr>
		<td>Coordinates</td><td>x, y, z, width, height, depth</td>
	</tr>
	<tr>
		<td>All others</td><td>Do not abbreviate</td>
	</tr>
</table>

1. All names SHOULD be as clear as necessary, SHOULD NOT be contracted just for
   the sake of less typing, and MUST avoid unclear shortenings and
   contractions (e.g. `MouseEventHandler`, not `MseEvtHdlr` or `hdl` or
   `h`).
1. Names representing an interface MUST NOT use "I" as a prefix (i.e. `Event`
   not `IEvent`).
1. Abbreviations and acronyms MUST NOT be uppercase when used as a name (i.e.
   `getXml` not `getXML`).
1. Collections MUST be named using a plural form.
1. Names representing boolean states SHOULD start with `is`, `has`, `can`, or
   `should`.
1. Names representing boolean states MUST NOT be negative (i.e. `isNotFoo` is
   unacceptable).
1. Names representing a count of a number of objects SHOULD start with `num`.
1. Names representing methods SHOULD be verbs or verb phrases (i.e.
   `getValue()`, not `value()`).
1. Non-constructor methods that generate new objects SHOULD use the verb
   "create".
1. Magic numbers MUST either be represented using a constant, an enum, or be prefixed
   with a comment representing the literal value of the number (e.g.
   `if (event.keyCode === Keys.KEY_A)` or
   `if (event.keyCode === /* "a" */ 97)`).

### Style

1. All immutable variables MUST be declared with `const`:

   ```typescript
   // right
   const a = 1;

   // wrong
   var a = 1;
   let a = 1;
   ```

1. All mutable variables MUST be declared with `let`:

   ```typescript
   // right
   for (let i = 0; i < items.length; i++) {
   }

   // wrong
   for (var i = 0; i < items.length; i++) {
   }
   ```

1. All variable declarations MUST use one `const` or `let` declaration per
   variable. The exception to this rule is the initialization expression of
   a `for` statement. This prevents variable declarations being lost inside
   long lists that may also include immediate assignments:

   ```typescript
   // right
   const items = getItems();
   const length = items.length;
   let i = 0;
   let item;

   // also right
   const items = getItems();
   for (let i = 0, item; (item = items[i]); i++) {
   }

   // wrong
   const items = getItems(), length = items.length;
   let i = 0,
       item;
   ```

1. Variable declarations SHOULD be grouped by declaration type; `const` first,
   then `let`:

   ```typescript
   // right
   const items = getItems();
   const length = items.length;
   let i = 0;
   let item;

   // wrong
   const items = getItems();
   let item;
   const length = items.length;
   let i = 0;
   ```

1. Variables SHOULD be declared where they are first assigned:

   ```typescript
   // right
   render(): void {
       const items = this.getItems();

       if (!items.length) {
           return;
       }

       for (let i = 0, item; (item = items[i]); i++) {
           this.renderItem(item);
       }
   }

   // wrong
   render(): void {
       const items = this.getItems();
       let i;
       let item;

       if (!items.length) {
           return;
       }

       for (i = 0; (item = items[i]); i++) {
           this.renderItem(item);
       }
   }
   ```

1. The most appropriate data types SHOULD be used in all cases (i.e. boolean for
   booleans, not number).

1. Class properties SHOULD be ordered alphabetically, case-insensitive,
   ignoring leading underscores, in the following order:
* static properties
* static methods
* instance properties (including getters and setters)
* instance index signature
* constructor
* instance methods

1. Interface properties SHOULD be ordered alphabetically, case-insensitive,
   ignoring leading underscores, in the following order:
* properties
* index signature
* constructor
* function call
* methods

1. Module exports SHOULD be ordered alphabetically, case-insensitive,
   by identifier.

1. Functions MUST be declared before their use. The exceptions to this rule
   are functions exported from a module and methods of a class:

   ```typescript
   // right
   function getItems(): Item[] {
       // ...
   }

   const items = getItems();

   // also right
   export function one(): void {
       two();
   }

   export function two(): void {
       // ...
   }

   // wrong
   const items = getItems();

   function getItems(): Item[] {
       // ...
   }
   ```

### Whitespace and Layout

1. Files MUST use hard tabs for indentation. Spaces MAY be used for alignment.

1. The following reserved words MUST NOT be followed by a space:

* break
* continue
* default
* return (used alone)
* this

1. The following reserved words MUST be followed by a space:

* case
* catch
* class
* const
* declare
* delete
* do
* else
* enum
* export
* finally
* for
* function
* if
* import
* in
* instanceof
* let
* new
* private
* protected
* return (used to return a value)
* static
* switch
* throw
* try
* type
* typeof
* var
* while
* with

1. Commas SHOULD be followed by a space.

1. Colons in a type definition MUST be followed by a space. Colons in expressions
   (i.e. ternary operator) SHOULD be surrounded by spaces.

1. Semi-colons in `for` statements MUST be followed by a space.

1. Semi-colons MUST NOT be preceded by a space.

1. The opening bracket of a code block MUST be written on the same line as its
   statement:

   ```typescript
   // right
   if (foo) {

   }

   // wrong
   if (foo)
   {

   }
   ```

1. Blocks with a single statement MUST NOT be written on the same line as the
   opening bracket:

   ```typescript
   // right
   if (foo) {
       bar;
   }

   // wrong
   if (foo) { bar; }
   ```

1. The opening and closing brackets on objects and arrays MUST be surrounded by
   whitespace on the inside of the object literal:

   ```typescript
   // right
   var obj = { foo: 'foo' },
       arr = [ obj, 'foo' ];

   // wrong
   var obj = {foo: 'foo'},
       arr = [obj, 'foo'];
   ```

1. `else` and `while` keywords MUST be on their own line, not cuddled with the
   closing bracket of the previous `if`/`do` block. This is consistent with the
   use of all other block statements and allows comments to be placed
   consistently before conditional statements, rather than sometimes-before,
   sometimes-inside:

   ```typescript
   // right
   if (foo) {
   }
   else if (bar) {
   }
   else {
   }

   do {
   }
   while (baz)

   // wrong
   if (foo) {
   } else if (bar) {
   } else {
   }

   do {
   } while(baz)
   ```
