// Transcrypt'ed from Python, 2019-01-18 19:58:38
var __name__ = 'org.transcrypt.__runtime__';

function __nest__ (headObject, tailNames, value) {
    var current = headObject;
    if (tailNames != '') {
        var tailChain = tailNames.split ('.');
        var firstNewIndex = tailChain.length;
        for (var index = 0; index < tailChain.length; index++) {
            if (!current.hasOwnProperty (tailChain [index])) {
                firstNewIndex = index;
                break;
            }
            current = current [tailChain [index]];
        }
        for (var index = firstNewIndex; index < tailChain.length; index++) {
            current [tailChain [index]] = {};
            current = current [tailChain [index]];
        }
    }
    for (let attrib of Object.getOwnPropertyNames (value)) {
        Object.defineProperty (current, attrib, {
            get () {return value [attrib];},
            enumerable: true,
            configurable: true
        });
    }
}function __get__ (self, func, quotedFuncName) {
    if (self) {
        if (self.hasOwnProperty ('__class__') || typeof self == 'string' || self instanceof String) {
            if (quotedFuncName) {
                Object.defineProperty (self, quotedFuncName, {
                    value: function () {
                        var args = [] .slice.apply (arguments);
                        return func.apply (null, [self] .concat (args));
                    },
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
            return function () {
                var args = [] .slice.apply (arguments);
                return func.apply (null, [self] .concat (args));
            };
        }
        else {
            return func;
        }
    }
    else {
        return func;
    }
}var py_metatype = {
    __name__: 'type',
    __bases__: [],
    __new__: function (meta, name, bases, attribs) {
        var cls = function () {
            var args = [] .slice.apply (arguments);
            return cls.__new__ (args);
        };
        for (var index = bases.length - 1; index >= 0; index--) {
            var base = bases [index];
            for (var attrib in base) {
                var descrip = Object.getOwnPropertyDescriptor (base, attrib);
                Object.defineProperty (cls, attrib, descrip);
            }
            for (let symbol of Object.getOwnPropertySymbols (base)) {
                let descrip = Object.getOwnPropertyDescriptor (base, symbol);
                Object.defineProperty (cls, symbol, descrip);
            }
        }
        cls.__metaclass__ = meta;
        cls.__name__ = name.startsWith ('py_') ? name.slice (3) : name;
        cls.__bases__ = bases;
        for (var attrib in attribs) {
            var descrip = Object.getOwnPropertyDescriptor (attribs, attrib);
            Object.defineProperty (cls, attrib, descrip);
        }
        for (let symbol of Object.getOwnPropertySymbols (attribs)) {
            let descrip = Object.getOwnPropertyDescriptor (attribs, symbol);
            Object.defineProperty (cls, symbol, descrip);
        }
        return cls;
    }
};
py_metatype.__metaclass__ = py_metatype;
var object = {
    __init__: function (self) {},
    __metaclass__: py_metatype,
    __name__: 'object',
    __bases__: [],
    __new__: function (args) {
        var instance = Object.create (this, {__class__: {value: this, enumerable: true}});
        if ('__getattr__' in this || '__setattr__' in this) {
            instance = new Proxy (instance, {
                get: function (target, name) {
                    let result = target [name];
                    if (result == undefined) {
                        return target.__getattr__ (name);
                    }
                    else {
                        return result;
                    }
                },
                set: function (target, name, value) {
                    try {
                        target.__setattr__ (name, value);
                    }
                    catch (exception) {
                        target [name] = value;
                    }
                    return true;
                }
            });
        }
        this.__init__.apply (null, [instance] .concat (args));
        return instance;
    }
};
function __class__ (name, bases, attribs, meta) {
    if (meta === undefined) {
        meta = bases [0] .__metaclass__;
    }
    return meta.__new__ (meta, name, bases, attribs);
}function __call__ (/* <callee>, <this>, <params>* */) {
    var args = [] .slice.apply (arguments);
    if (typeof args [0] == 'object' && '__call__' in args [0]) {
        return args [0] .__call__ .apply (args [1], args.slice (2));
    }
    else {
        return args [0] .apply (args [1], args.slice (2));
    }
}function __kwargtrans__ (anObject) {
    anObject.__kwargtrans__ = null;
    anObject.constructor = Object;
    return anObject;
}
function __setproperty__ (anObject, name, descriptor) {
    if (!anObject.hasOwnProperty (name)) {
        Object.defineProperty (anObject, name, descriptor);
    }
}
function __in__ (element, container) {
    if (container === undefined || container === null) {
        return false;
    }
    if (container.__contains__ instanceof Function) {
        return container.__contains__ (element);
    }
    else {
        return (
            container.indexOf ?
            container.indexOf (element) > -1 :
            container.hasOwnProperty (element)
        );
    }
}function __specialattrib__ (attrib) {
    return (attrib.startswith ('__') && attrib.endswith ('__')) || attrib == 'constructor' || attrib.startswith ('py_');
}function len (anObject) {
    if (anObject === undefined || anObject === null) {
        return 0;
    }
    if (anObject.__len__ instanceof Function) {
        return anObject.__len__ ();
    }
    if (anObject.length !== undefined) {
        return anObject.length;
    }
    var length = 0;
    for (var attr in anObject) {
        if (!__specialattrib__ (attr)) {
            length++;
        }
    }
    return length;
}function __i__ (any) {
    return py_typeof (any) == dict ? any.py_keys () : any;
}
function __t__ (target) {
    return (
        target === undefined || target === null ? false :
        ['boolean', 'number'] .indexOf (typeof target) >= 0 ? target :
        target.__bool__ instanceof Function ? (target.__bool__ () ? target : false) :
        target.__len__ instanceof Function ?  (target.__len__ () !== 0 ? target : false) :
        target instanceof Function ? target :
        len (target) !== 0 ? target :
        false
    );
}
function float (any) {
    if (any == 'inf') {
        return Infinity;
    }
    else if (any == '-inf') {
        return -Infinity;
    }
    else if (any == 'nan') {
        return NaN;
    }
    else if (isNaN (parseFloat (any))) {
        if (any === false) {
            return 0;
        }
        else if (any === true) {
            return 1;
        }
        else {
            throw ValueError ("could not convert string to float: '" + str(any) + "'", new Error ());
        }
    }
    else {
        return +any;
    }
}float.__name__ = 'float';
float.__bases__ = [object];
function int (any) {
    return float (any) | 0
}int.__name__ = 'int';
int.__bases__ = [object];
function bool (any) {
    return !!__t__ (any);
}bool.__name__ = 'bool';
bool.__bases__ = [int];
function py_typeof (anObject) {
    var aType = typeof anObject;
    if (aType == 'object') {
        try {
            return '__class__' in anObject ? anObject.__class__ : object;
        }
        catch (exception) {
            return aType;
        }
    }
    else {
        return (
            aType == 'boolean' ? bool :
            aType == 'string' ? str :
            aType == 'number' ? (anObject % 1 == 0 ? int : float) :
            null
        );
    }
}function issubclass (aClass, classinfo) {
    if (classinfo instanceof Array) {
        for (let aClass2 of classinfo) {
            if (issubclass (aClass, aClass2)) {
                return true;
            }
        }
        return false;
    }
    try {
        var aClass2 = aClass;
        if (aClass2 == classinfo) {
            return true;
        }
        else {
            var bases = [].slice.call (aClass2.__bases__);
            while (bases.length) {
                aClass2 = bases.shift ();
                if (aClass2 == classinfo) {
                    return true;
                }
                if (aClass2.__bases__.length) {
                    bases = [].slice.call (aClass2.__bases__).concat (bases);
                }
            }
            return false;
        }
    }
    catch (exception) {
        return aClass == classinfo || classinfo == object;
    }
}function isinstance (anObject, classinfo) {
    try {
        return '__class__' in anObject ? issubclass (anObject.__class__, classinfo) : issubclass (py_typeof (anObject), classinfo);
    }
    catch (exception) {
        return issubclass (py_typeof (anObject), classinfo);
    }
}function repr (anObject) {
    try {
        return anObject.__repr__ ();
    }
    catch (exception) {
        try {
            return anObject.__str__ ();
        }
        catch (exception) {
            try {
                if (anObject == null) {
                    return 'None';
                }
                else if (anObject.constructor == Object) {
                    var result = '{';
                    var comma = false;
                    for (var attrib in anObject) {
                        if (!__specialattrib__ (attrib)) {
                            if (attrib.isnumeric ()) {
                                var attribRepr = attrib;
                            }
                            else {
                                var attribRepr = '\'' + attrib + '\'';
                            }
                            if (comma) {
                                result += ', ';
                            }
                            else {
                                comma = true;
                            }
                            result += attribRepr + ': ' + repr (anObject [attrib]);
                        }
                    }
                    result += '}';
                    return result;
                }
                else {
                    return typeof anObject == 'boolean' ? anObject.toString () .capitalize () : anObject.toString ();
                }
            }
            catch (exception) {
                return '<object of type: ' + typeof anObject + '>';
            }
        }
    }
}function max (nrOrSeq) {
    return arguments.length == 1 ? Math.max (...nrOrSeq) : Math.max (...arguments);
}function min (nrOrSeq) {
    return arguments.length == 1 ? Math.min (...nrOrSeq) : Math.min (...arguments);
}var abs = Math.abs;
function __PyIterator__ (iterable) {
    this.iterable = iterable;
    this.index = 0;
}
__PyIterator__.prototype.__next__ = function() {
    if (this.index < this.iterable.length) {
        return this.iterable [this.index++];
    }
    else {
        throw StopIteration (new Error ());
    }
};
function __JsIterator__ (iterable) {
    this.iterable = iterable;
    this.index = 0;
}
__JsIterator__.prototype.next = function () {
    if (this.index < this.iterable.py_keys.length) {
        return {value: this.index++, done: false};
    }
    else {
        return {value: undefined, done: true};
    }
};
function zip () {
    var args = [] .slice.call (arguments);
    for (var i = 0; i < args.length; i++) {
        if (typeof args [i] == 'string') {
            args [i] = args [i] .split ('');
        }
        else if (!Array.isArray (args [i])) {
            args [i] = Array.from (args [i]);
        }
    }
    var shortest = args.length == 0 ? [] : args.reduce (
        function (array0, array1) {
            return array0.length < array1.length ? array0 : array1;
        }
    );
    return shortest.map (
        function (current, index) {
            return args.map (
                function (current) {
                    return current [index];
                }
            );
        }
    );
}function range (start, stop, step) {
    if (stop == undefined) {
        stop = start;
        start = 0;
    }
    if (step == undefined) {
        step = 1;
    }
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }
    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }
    return result;
}function any (iterable) {
    for (let item of iterable) {
        if (bool (item)) {
            return true;
        }
    }
    return false;
}
function enumerate (iterable) {
    return zip (range (len (iterable)), iterable);
}
function copy (anObject) {
    if (anObject == null || typeof anObject == "object") {
        return anObject;
    }
    else {
        var result = {};
        for (var attrib in obj) {
            if (anObject.hasOwnProperty (attrib)) {
                result [attrib] = anObject [attrib];
            }
        }
        return result;
    }
}
function list (iterable) {
    let instance = iterable ? Array.from (iterable) : [];
    return instance;
}
Array.prototype.__class__ = list;
list.__name__ = 'list';
list.__bases__ = [object];
Array.prototype.__iter__ = function () {return new __PyIterator__ (this);};
Array.prototype.__getslice__ = function (start, stop, step) {
    if (start < 0) {
        start = this.length + start;
    }
    if (stop == null) {
        stop = this.length;
    }
    else if (stop < 0) {
        stop = this.length + stop;
    }
    else if (stop > this.length) {
        stop = this.length;
    }
    if (step == 1) {
        return Array.prototype.slice.call(this, start, stop);
    }
    let result = list ([]);
    for (let index = start; index < stop; index += step) {
        result.push (this [index]);
    }
    return result;
};
Array.prototype.__setslice__ = function (start, stop, step, source) {
    if (start < 0) {
        start = this.length + start;
    }
    if (stop == null) {
        stop = this.length;
    }
    else if (stop < 0) {
        stop = this.length + stop;
    }
    if (step == null) {
        Array.prototype.splice.apply (this, [start, stop - start] .concat (source));
    }
    else {
        let sourceIndex = 0;
        for (let targetIndex = start; targetIndex < stop; targetIndex += step) {
            this [targetIndex] = source [sourceIndex++];
        }
    }
};
Array.prototype.__repr__ = function () {
    if (this.__class__ == set && !this.length) {
        return 'set()';
    }
    let result = !this.__class__ || this.__class__ == list ? '[' : this.__class__ == tuple ? '(' : '{';
    for (let index = 0; index < this.length; index++) {
        if (index) {
            result += ', ';
        }
        result += repr (this [index]);
    }
    if (this.__class__ == tuple && this.length == 1) {
        result += ',';
    }
    result += !this.__class__ || this.__class__ == list ? ']' : this.__class__ == tuple ? ')' : '}';    return result;
};
Array.prototype.__str__ = Array.prototype.__repr__;
Array.prototype.append = function (element) {
    this.push (element);
};
Array.prototype.py_clear = function () {
    this.length = 0;
};
Array.prototype.extend = function (aList) {
    this.push.apply (this, aList);
};
Array.prototype.insert = function (index, element) {
    this.splice (index, 0, element);
};
Array.prototype.remove = function (element) {
    let index = this.indexOf (element);
    if (index == -1) {
        throw ValueError ("list.remove(x): x not in list", new Error ());
    }
    this.splice (index, 1);
};
Array.prototype.index = function (element) {
    return this.indexOf (element);
};
Array.prototype.py_pop = function (index) {
    if (index == undefined) {
        return this.pop ();
    }
    else {
        return this.splice (index, 1) [0];
    }
};
Array.prototype.py_sort = function () {
    __sort__.apply  (null, [this].concat ([] .slice.apply (arguments)));
};
Array.prototype.__add__ = function (aList) {
    return list (this.concat (aList));
};
Array.prototype.__mul__ = function (scalar) {
    let result = this;
    for (let i = 1; i < scalar; i++) {
        result = result.concat (this);
    }
    return result;
};
Array.prototype.__rmul__ = Array.prototype.__mul__;
function tuple (iterable) {
    let instance = iterable ? [] .slice.apply (iterable) : [];
    instance.__class__ = tuple;
    return instance;
}
tuple.__name__ = 'tuple';
tuple.__bases__ = [object];
function set (iterable) {
    let instance = [];
    if (iterable) {
        for (let index = 0; index < iterable.length; index++) {
            instance.add (iterable [index]);
        }
    }
    instance.__class__ = set;
    return instance;
}
set.__name__ = 'set';
set.__bases__ = [object];
Array.prototype.__bindexOf__ = function (element) {
    element += '';
    let mindex = 0;
    let maxdex = this.length - 1;
    while (mindex <= maxdex) {
        let index = (mindex + maxdex) / 2 | 0;
        let middle = this [index] + '';
        if (middle < element) {
            mindex = index + 1;
        }
        else if (middle > element) {
            maxdex = index - 1;
        }
        else {
            return index;
        }
    }
    return -1;
};
Array.prototype.add = function (element) {
    if (this.indexOf (element) == -1) {
        this.push (element);
    }
};
Array.prototype.discard = function (element) {
    var index = this.indexOf (element);
    if (index != -1) {
        this.splice (index, 1);
    }
};
Array.prototype.isdisjoint = function (other) {
    this.sort ();
    for (let i = 0; i < other.length; i++) {
        if (this.__bindexOf__ (other [i]) != -1) {
            return false;
        }
    }
    return true;
};
Array.prototype.issuperset = function (other) {
    this.sort ();
    for (let i = 0; i < other.length; i++) {
        if (this.__bindexOf__ (other [i]) == -1) {
            return false;
        }
    }
    return true;
};
Array.prototype.issubset = function (other) {
    return set (other.slice ()) .issuperset (this);
};
Array.prototype.union = function (other) {
    let result = set (this.slice () .sort ());
    for (let i = 0; i < other.length; i++) {
        if (result.__bindexOf__ (other [i]) == -1) {
            result.push (other [i]);
        }
    }
    return result;
};
Array.prototype.intersection = function (other) {
    this.sort ();
    let result = set ();
    for (let i = 0; i < other.length; i++) {
        if (this.__bindexOf__ (other [i]) != -1) {
            result.push (other [i]);
        }
    }
    return result;
};
Array.prototype.difference = function (other) {
    let sother = set (other.slice () .sort ());
    let result = set ();
    for (let i = 0; i < this.length; i++) {
        if (sother.__bindexOf__ (this [i]) == -1) {
            result.push (this [i]);
        }
    }
    return result;
};
Array.prototype.symmetric_difference = function (other) {
    return this.union (other) .difference (this.intersection (other));
};
Array.prototype.py_update = function () {
    let updated = [] .concat.apply (this.slice (), arguments) .sort ();
    this.py_clear ();
    for (let i = 0; i < updated.length; i++) {
        if (updated [i] != updated [i - 1]) {
            this.push (updated [i]);
        }
    }
};
Array.prototype.__eq__ = function (other) {
    if (this.length != other.length) {
        return false;
    }
    if (this.__class__ == set) {
        this.sort ();
        other.sort ();
    }
    for (let i = 0; i < this.length; i++) {
        if (this [i] != other [i]) {
            return false;
        }
    }
    return true;
};
Array.prototype.__ne__ = function (other) {
    return !this.__eq__ (other);
};
Array.prototype.__le__ = function (other) {
    if (this.__class__ == set) {
        return this.issubset (other);
    }
    else {
        for (let i = 0; i < this.length; i++) {
            if (this [i] > other [i]) {
                return false;
            }
            else if (this [i] < other [i]) {
                return true;
            }
        }
        return true;
    }
};
Array.prototype.__ge__ = function (other) {
    if (this.__class__ == set) {
        return this.issuperset (other);
    }
    else {
        for (let i = 0; i < this.length; i++) {
            if (this [i] < other [i]) {
                return false;
            }
            else if (this [i] > other [i]) {
                return true;
            }
        }
        return true;
    }
};
Array.prototype.__lt__ = function (other) {
    return (
        this.__class__ == set ?
        this.issubset (other) && !this.issuperset (other) :
        !this.__ge__ (other)
    );
};
Array.prototype.__gt__ = function (other) {
    return (
        this.__class__ == set ?
        this.issuperset (other) && !this.issubset (other) :
        !this.__le__ (other)
    );
};
Uint8Array.prototype.__add__ = function (aBytes) {
    let result = new Uint8Array (this.length + aBytes.length);
    result.set (this);
    result.set (aBytes, this.length);
    return result;
};
Uint8Array.prototype.__mul__ = function (scalar) {
    let result = new Uint8Array (scalar * this.length);
    for (let i = 0; i < scalar; i++) {
        result.set (this, i * this.length);
    }
    return result;
};
Uint8Array.prototype.__rmul__ = Uint8Array.prototype.__mul__;
function str (stringable) {
    if (typeof stringable === 'number')
        return stringable.toString();
    else {
        try {
            return stringable.__str__ ();
        }
        catch (exception) {
            try {
                return repr (stringable);
            }
            catch (exception) {
                return String (stringable);
            }
        }
    }
}String.prototype.__class__ = str;
str.__name__ = 'str';
str.__bases__ = [object];
String.prototype.__iter__ = function () {};
String.prototype.__repr__ = function () {
    return (this.indexOf ('\'') == -1 ? '\'' + this + '\'' : '"' + this + '"') .py_replace ('\t', '\\t') .py_replace ('\n', '\\n');
};
String.prototype.__str__ = function () {
    return this;
};
String.prototype.capitalize = function () {
    return this.charAt (0).toUpperCase () + this.slice (1);
};
String.prototype.endswith = function (suffix) {
    if (suffix instanceof Array) {
        for (var i=0;i<suffix.length;i++) {
            if (this.slice (-suffix[i].length) == suffix[i])
                return true;
        }
    } else
        return suffix == '' || this.slice (-suffix.length) == suffix;
    return false;
};
String.prototype.find = function (sub, start) {
    return this.indexOf (sub, start);
};
String.prototype.__getslice__ = function (start, stop, step) {
    if (start < 0) {
        start = this.length + start;
    }
    if (stop == null) {
        stop = this.length;
    }
    else if (stop < 0) {
        stop = this.length + stop;
    }
    var result = '';
    if (step == 1) {
        result = this.substring (start, stop);
    }
    else {
        for (var index = start; index < stop; index += step) {
            result = result.concat (this.charAt(index));
        }
    }
    return result;
};
__setproperty__ (String.prototype, 'format', {
    get: function () {return __get__ (this, function (self) {
        var args = tuple ([] .slice.apply (arguments).slice (1));
        var autoIndex = 0;
        return self.replace (/\{(\w*)\}/g, function (match, key) {
            if (key == '') {
                key = autoIndex++;
            }
            if (key == +key) {
                return args [key] === undefined ? match : str (args [key]);
            }
            else {
                for (var index = 0; index < args.length; index++) {
                    if (typeof args [index] == 'object' && args [index][key] !== undefined) {
                        return str (args [index][key]);
                    }
                }
                return match;
            }
        });
    });},
    enumerable: true
});
String.prototype.isalnum = function () {
    return /^[0-9a-zA-Z]{1,}$/.test(this)
};
String.prototype.isalpha = function () {
    return /^[a-zA-Z]{1,}$/.test(this)
};
String.prototype.isdecimal = function () {
    return /^[0-9]{1,}$/.test(this)
};
String.prototype.isdigit = function () {
    return this.isdecimal()
};
String.prototype.islower = function () {
    return /^[a-z]{1,}$/.test(this)
};
String.prototype.isupper = function () {
    return /^[A-Z]{1,}$/.test(this)
};
String.prototype.isspace = function () {
    return /^[\s]{1,}$/.test(this)
};
String.prototype.isnumeric = function () {
    return !isNaN (parseFloat (this)) && isFinite (this);
};
String.prototype.join = function (strings) {
    strings = Array.from (strings);
    return strings.join (this);
};
String.prototype.lower = function () {
    return this.toLowerCase ();
};
String.prototype.py_replace = function (old, aNew, maxreplace) {
    return this.split (old, maxreplace) .join (aNew);
};
String.prototype.lstrip = function () {
    return this.replace (/^\s*/g, '');
};
String.prototype.rfind = function (sub, start) {
    return this.lastIndexOf (sub, start);
};
String.prototype.rsplit = function (sep, maxsplit) {
    if (sep == undefined || sep == null) {
        sep = /\s+/;
        var stripped = this.strip ();
    }
    else {
        var stripped = this;
    }
    if (maxsplit == undefined || maxsplit == -1) {
        return stripped.split (sep);
    }
    else {
        var result = stripped.split (sep);
        if (maxsplit < result.length) {
            var maxrsplit = result.length - maxsplit;
            return [result.slice (0, maxrsplit) .join (sep)] .concat (result.slice (maxrsplit));
        }
        else {
            return result;
        }
    }
};
String.prototype.rstrip = function () {
    return this.replace (/\s*$/g, '');
};
String.prototype.py_split = function (sep, maxsplit) {
    if (sep == undefined || sep == null) {
        sep = /\s+/;
        var stripped = this.strip ();
    }
    else {
        var stripped = this;
    }
    if (maxsplit == undefined || maxsplit == -1) {
        return stripped.split (sep);
    }
    else {
        var result = stripped.split (sep);
        if (maxsplit < result.length) {
            return result.slice (0, maxsplit).concat ([result.slice (maxsplit).join (sep)]);
        }
        else {
            return result;
        }
    }
};
String.prototype.startswith = function (prefix) {
    if (prefix instanceof Array) {
        for (var i=0;i<prefix.length;i++) {
            if (this.indexOf (prefix [i]) == 0)
                return true;
        }
    } else
        return this.indexOf (prefix) == 0;
    return false;
};
String.prototype.strip = function () {
    return this.trim ();
};
String.prototype.upper = function () {
    return this.toUpperCase ();
};
String.prototype.__mul__ = function (scalar) {
    var result = '';
    for (var i = 0; i < scalar; i++) {
        result = result + this;
    }
    return result;
};
String.prototype.__rmul__ = String.prototype.__mul__;
function __contains__ (element) {
    return this.hasOwnProperty (element);
}
function __keys__ () {
    var keys = [];
    for (var attrib in this) {
        if (!__specialattrib__ (attrib)) {
            keys.push (attrib);
        }
    }
    return keys;
}
function __items__ () {
    var items = [];
    for (var attrib in this) {
        if (!__specialattrib__ (attrib)) {
            items.push ([attrib, this [attrib]]);
        }
    }
    return items;
}
function __del__ (key) {
    delete this [key];
}
function __clear__ () {
    for (var attrib in this) {
        delete this [attrib];
    }
}
function __getdefault__ (aKey, aDefault) {
    var result = this [aKey];
    if (result == undefined) {
        result = this ['py_' + aKey];
    }
    return result == undefined ? (aDefault == undefined ? null : aDefault) : result;
}
function __setdefault__ (aKey, aDefault) {
    var result = this [aKey];
    if (result != undefined) {
        return result;
    }
    var val = aDefault == undefined ? null : aDefault;
    this [aKey] = val;
    return val;
}
function __pop__ (aKey, aDefault) {
    var result = this [aKey];
    if (result != undefined) {
        delete this [aKey];
        return result;
    } else {
        if ( aDefault === undefined ) {
            throw KeyError (aKey, new Error());
        }
    }
    return aDefault;
}
function __popitem__ () {
    var aKey = Object.keys (this) [0];
    if (aKey == null) {
        throw KeyError ("popitem(): dictionary is empty", new Error ());
    }
    var result = tuple ([aKey, this [aKey]]);
    delete this [aKey];
    return result;
}
function __update__ (aDict) {
    for (var aKey in aDict) {
        this [aKey] = aDict [aKey];
    }
}
function __values__ () {
    var values = [];
    for (var attrib in this) {
        if (!__specialattrib__ (attrib)) {
            values.push (this [attrib]);
        }
    }
    return values;
}
function __dgetitem__ (aKey) {
    return this [aKey];
}
function __dsetitem__ (aKey, aValue) {
    this [aKey] = aValue;
}
function dict (objectOrPairs) {
    var instance = {};
    if (!objectOrPairs || objectOrPairs instanceof Array) {
        if (objectOrPairs) {
            for (var index = 0; index < objectOrPairs.length; index++) {
                var pair = objectOrPairs [index];
                if ( !(pair instanceof Array) || pair.length != 2) {
                    throw ValueError(
                        "dict update sequence element #" + index +
                        " has length " + pair.length +
                        "; 2 is required", new Error());
                }
                var key = pair [0];
                var val = pair [1];
                if (!(objectOrPairs instanceof Array) && objectOrPairs instanceof Object) {
                     if (!isinstance (objectOrPairs, dict)) {
                         val = dict (val);
                     }
                }
                instance [key] = val;
            }
        }
    }
    else {
        if (isinstance (objectOrPairs, dict)) {
            var aKeys = objectOrPairs.py_keys ();
            for (var index = 0; index < aKeys.length; index++ ) {
                var key = aKeys [index];
                instance [key] = objectOrPairs [key];
            }
        } else if (objectOrPairs instanceof Object) {
            instance = objectOrPairs;
        } else {
            throw ValueError ("Invalid type of object for dict creation", new Error ());
        }
    }
    __setproperty__ (instance, '__class__', {value: dict, enumerable: false, writable: true});
    __setproperty__ (instance, '__contains__', {value: __contains__, enumerable: false});
    __setproperty__ (instance, 'py_keys', {value: __keys__, enumerable: false});
    __setproperty__ (instance, '__iter__', {value: function () {new __PyIterator__ (this.py_keys ());}, enumerable: false});
    __setproperty__ (instance, Symbol.iterator, {value: function () {new __JsIterator__ (this.py_keys ());}, enumerable: false});
    __setproperty__ (instance, 'py_items', {value: __items__, enumerable: false});
    __setproperty__ (instance, 'py_del', {value: __del__, enumerable: false});
    __setproperty__ (instance, 'py_clear', {value: __clear__, enumerable: false});
    __setproperty__ (instance, 'py_get', {value: __getdefault__, enumerable: false});
    __setproperty__ (instance, 'py_setdefault', {value: __setdefault__, enumerable: false});
    __setproperty__ (instance, 'py_pop', {value: __pop__, enumerable: false});
    __setproperty__ (instance, 'py_popitem', {value: __popitem__, enumerable: false});
    __setproperty__ (instance, 'py_update', {value: __update__, enumerable: false});
    __setproperty__ (instance, 'py_values', {value: __values__, enumerable: false});
    __setproperty__ (instance, '__getitem__', {value: __dgetitem__, enumerable: false});
    __setproperty__ (instance, '__setitem__', {value: __dsetitem__, enumerable: false});
    return instance;
}
dict.__name__ = 'dict';
dict.__bases__ = [object];
function __setdoc__ (docString) {
    this.__doc__ = docString;
    return this;
}
__setproperty__ (Function.prototype, '__setdoc__', {value: __setdoc__, enumerable: false});
function __mod__ (a, b) {
    if (typeof a == 'object' && '__mod__' in a) {
        return a.__mod__ (b);
    }
    else if (typeof b == 'object' && '__rmod__' in b) {
        return b.__rmod__ (a);
    }
    else {
        return ((a % b) + b) % b;
    }
}function __pow__ (a, b) {
    if (typeof a == 'object' && '__pow__' in a) {
        return a.__pow__ (b);
    }
    else if (typeof b == 'object' && '__rpow__' in b) {
        return b.__rpow__ (a);
    }
    else {
        return Math.pow (a, b);
    }
}function __neg__ (a) {
    if (typeof a == 'object' && '__neg__' in a) {
        return a.__neg__ ();
    }
    else {
        return -a;
    }
}function __mul__ (a, b) {
    if (typeof a == 'object' && '__mul__' in a) {
        return a.__mul__ (b);
    }
    else if (typeof b == 'object' && '__rmul__' in b) {
        return b.__rmul__ (a);
    }
    else if (typeof a == 'string') {
        return a.__mul__ (b);
    }
    else if (typeof b == 'string') {
        return b.__rmul__ (a);
    }
    else {
        return a * b;
    }
}function __floordiv__ (a, b) {
    if (typeof a == 'object' && '__floordiv__' in a) {
        return a.__floordiv__ (b);
    }
    else if (typeof b == 'object' && '__rfloordiv__' in b) {
        return b.__rfloordiv__ (a);
    }
    else if (typeof a == 'object' && '__div__' in a) {
        return a.__div__ (b);
    }
    else if (typeof b == 'object' && '__rdiv__' in b) {
        return b.__rdiv__ (a);
    }
    else {
        return Math.floor (a / b);
    }
}function __add__ (a, b) {
    if (typeof a == 'object' && '__add__' in a) {
        return a.__add__ (b);
    }
    else if (typeof b == 'object' && '__radd__' in b) {
        return b.__radd__ (a);
    }
    else {
        return a + b;
    }
}function __sub__ (a, b) {
    if (typeof a == 'object' && '__sub__' in a) {
        return a.__sub__ (b);
    }
    else if (typeof b == 'object' && '__rsub__' in b) {
        return b.__rsub__ (a);
    }
    else {
        return a - b;
    }
}function __eq__ (a, b) {
    if (typeof a == 'object' && '__eq__' in a) {
        return a.__eq__ (b);
    }
    else {
        return a == b;
    }
}function __ne__ (a, b) {
    if (typeof a == 'object' && '__ne__' in a) {
        return a.__ne__ (b);
    }
    else {
        return a != b
    }
}function __lt__ (a, b) {
    if (typeof a == 'object' && '__lt__' in a) {
        return a.__lt__ (b);
    }
    else {
        return a < b;
    }
}function __le__ (a, b) {
    if (typeof a == 'object' && '__le__' in a) {
        return a.__le__ (b);
    }
    else {
        return a <= b;
    }
}function __gt__ (a, b) {
    if (typeof a == 'object' && '__gt__' in a) {
        return a.__gt__ (b);
    }
    else {
        return a > b;
    }
}function __ge__ (a, b) {
    if (typeof a == 'object' && '__ge__' in a) {
        return a.__ge__ (b);
    }
    else {
        return a >= b;
    }
}function __iadd__ (a, b) {
    if (typeof a == 'object' && '__iadd__' in a) {
        return a.__iadd__ (b);
    }
    else if (typeof a == 'object' && '__add__' in a) {
        return a = a.__add__ (b);
    }
    else if (typeof b == 'object' && '__radd__' in b) {
        return a = b.__radd__ (a);
    }
    else {
        return a += b;
    }
}function __isub__ (a, b) {
    if (typeof a == 'object' && '__isub__' in a) {
        return a.__isub__ (b);
    }
    else if (typeof a == 'object' && '__sub__' in a) {
        return a = a.__sub__ (b);
    }
    else if (typeof b == 'object' && '__rsub__' in b) {
        return a = b.__rsub__ (a);
    }
    else {
        return a -= b;
    }
}function __ilshift__ (a, b) {
    if (typeof a == 'object' && '__ilshift__' in a) {
        return a.__ilshift__ (b);
    }
    else if (typeof a == 'object' && '__lshift__' in a) {
        return a = a.__lshift__ (b);
    }
    else if (typeof b == 'object' && '__rlshift__' in b) {
        return a = b.__rlshift__ (a);
    }
    else {
        return a <<= b;
    }
}function __irshift__ (a, b) {
    if (typeof a == 'object' && '__irshift__' in a) {
        return a.__irshift__ (b);
    }
    else if (typeof a == 'object' && '__rshift__' in a) {
        return a = a.__rshift__ (b);
    }
    else if (typeof b == 'object' && '__rrshift__' in b) {
        return a = b.__rrshift__ (a);
    }
    else {
        return a >>= b;
    }
}function __getitem__ (container, key) {
    if (typeof container == 'object' && '__getitem__' in container) {
        return container.__getitem__ (key);
    }
    else if ((typeof container == 'string' || container instanceof Array) && key < 0) {
        return container [container.length + key];
    }
    else {
        return container [key];
    }
}function __setitem__ (container, key, value) {
    if (typeof container == 'object' && '__setitem__' in container) {
        container.__setitem__ (key, value);
    }
    else if ((typeof container == 'string' || container instanceof Array) && key < 0) {
        container [container.length + key] = value;
    }
    else {
        container [key] = value;
    }
}function __getslice__ (container, lower, upper, step) {
    if (typeof container == 'object' && '__getitem__' in container) {
        return container.__getitem__ ([lower, upper, step]);
    }
    else {
        return container.__getslice__ (lower, upper, step);
    }
}var BaseException =  __class__ ('BaseException', [object], {
	__module__: __name__,
});
var Exception =  __class__ ('Exception', [BaseException], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		var kwargs = dict ();
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
					}
				}
				delete kwargs.__kwargtrans__;
			}
			var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
		}
		else {
			var args = tuple ();
		}
		self.__args__ = args;
		try {
			self.stack = kwargs.error.stack;
		}
		catch (__except0__) {
			self.stack = 'No stack trace available';
		}
	});},
	get __repr__ () {return __get__ (this, function (self) {
		if (len (self.__args__) > 1) {
			return '{}{}'.format (self.__class__.__name__, repr (tuple (self.__args__)));
		}
		else if (len (self.__args__)) {
			return '{}({})'.format (self.__class__.__name__, repr (self.__args__ [0]));
		}
		else {
			return '{}()'.format (self.__class__.__name__);
		}
	});},
	get __str__ () {return __get__ (this, function (self) {
		if (len (self.__args__) > 1) {
			return str (tuple (self.__args__));
		}
		else if (len (self.__args__)) {
			return str (self.__args__ [0]);
		}
		else {
			return '';
		}
	});}
});
var IterableError =  __class__ ('IterableError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, error) {
		Exception.__init__ (self, "Can't iterate over non-iterable", __kwargtrans__ ({error: error}));
	});}
});
var StopIteration =  __class__ ('StopIteration', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, error) {
		Exception.__init__ (self, 'Iterator exhausted', __kwargtrans__ ({error: error}));
	});}
});
var ValueError =  __class__ ('ValueError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
	});}
});
var KeyError =  __class__ ('KeyError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
	});}
});
var AssertionError =  __class__ ('AssertionError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		if (message) {
			Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
		}
		else {
			Exception.__init__ (self, __kwargtrans__ ({error: error}));
		}
	});}
});
var NotImplementedError =  __class__ ('NotImplementedError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
	});}
});
var IndexError =  __class__ ('IndexError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
	});}
});
var AttributeError =  __class__ ('AttributeError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
	});}
});
var py_TypeError =  __class__ ('py_TypeError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
	});}
});
var Warning =  __class__ ('Warning', [Exception], {
	__module__: __name__,
});
var UserWarning =  __class__ ('UserWarning', [Warning], {
	__module__: __name__,
});
var DeprecationWarning =  __class__ ('DeprecationWarning', [Warning], {
	__module__: __name__,
});
var RuntimeWarning =  __class__ ('RuntimeWarning', [Warning], {
	__module__: __name__,
});
var __sort__ = function (iterable, key, reverse) {
	if (typeof key == 'undefined' || (key != null && key.hasOwnProperty ("__kwargtrans__"))) {		var key = null;
	}	if (typeof reverse == 'undefined' || (reverse != null && reverse.hasOwnProperty ("__kwargtrans__"))) {		var reverse = false;
	}	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
					case 'key': var key = __allkwargs0__ [__attrib0__]; break;
					case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	if (key) {
		iterable.sort ((function __lambda__ (a, b) {
			if (arguments.length) {
				var __ilastarg0__ = arguments.length - 1;
				if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
					var __allkwargs0__ = arguments [__ilastarg0__--];
					for (var __attrib0__ in __allkwargs0__) {
						switch (__attrib0__) {
							case 'a': var a = __allkwargs0__ [__attrib0__]; break;
							case 'b': var b = __allkwargs0__ [__attrib0__]; break;
						}
					}
				}
			}
			return (key (a) > key (b) ? 1 : -(1));
		}));
	}
	else {
		iterable.sort ();
	}
	if (reverse) {
		iterable.reverse ();
	}
};
var sorted = function (iterable, key, reverse) {
	if (typeof key == 'undefined' || (key != null && key.hasOwnProperty ("__kwargtrans__"))) {		var key = null;
	}	if (typeof reverse == 'undefined' || (reverse != null && reverse.hasOwnProperty ("__kwargtrans__"))) {		var reverse = false;
	}	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
					case 'key': var key = __allkwargs0__ [__attrib0__]; break;
					case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	if (py_typeof (iterable) == dict) {
		var result = copy (iterable.py_keys ());
	}
	else {
		var result = copy (iterable);
	}
	__sort__ (result, key, reverse);
	return result;
};
var divmod = function (n, d) {
	return tuple ([Math.floor (n / d), __mod__ (n, d)]);
};
var __Terminal__ =  __class__ ('__Terminal__', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		self.buffer = '';
		try {
			self.element = document.getElementById ('__terminal__');
		}
		catch (__except0__) {
			self.element = null;
		}
		if (self.element) {
			self.element.style.overflowX = 'auto';
			self.element.style.boxSizing = 'border-box';
			self.element.style.padding = '5px';
			self.element.innerHTML = '_';
		}
	});},
	get print () {return __get__ (this, function (self) {
		var sep = ' ';
		var end = '\n';
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'sep': var sep = __allkwargs0__ [__attrib0__]; break;
						case 'end': var end = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
			var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
		}
		else {
			var args = tuple ();
		}
		self.buffer = '{}{}{}'.format (self.buffer, sep.join ((function () {
			var __accu0__ = [];
			for (var arg of args) {
				__accu0__.append (str (arg));
			}
			return __accu0__;
		}) ()), end).__getslice__ (-(4096), null, 1);
		if (self.element) {
			self.element.innerHTML = self.buffer.py_replace ('\n', '<br>').py_replace (' ', '&nbsp');
			self.element.scrollTop = self.element.scrollHeight;
		}
		else {
			console.log (sep.join ((function () {
				var __accu0__ = [];
				for (var arg of args) {
					__accu0__.append (str (arg));
				}
				return __accu0__;
			}) ()));
		}
	});},
	get input () {return __get__ (this, function (self, question) {
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'question': var question = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
		}
		self.print ('{}'.format (question), __kwargtrans__ ({end: ''}));
		var answer = window.prompt ('\n'.join (self.buffer.py_split ('\n').__getslice__ (-(8), null, 1)));
		self.print (answer);
		return answer;
	});}
});
var __terminal__ = __Terminal__ ();
var print = __terminal__.print;
var input = __terminal__.input;

// Transcrypt'ed from Python, 2019-01-18 19:58:38
var pi = Math.PI;
var e = Math.E;
var exp = Math.exp;
var expm1 = function (x) {
	return Math.exp (x) - 1;
};
var log = function (x, base) {
	return (base === undefined ? Math.log (x) : Math.log (x) / Math.log (base));
};
var log1p = function (x) {
	return Math.log (x + 1);
};
var log2 = function (x) {
	return Math.log (x) / Math.LN2;
};
var log10 = function (x) {
	return Math.log (x) / Math.LN10;
};
var pow$1 = Math.pow;
var sqrt = Math.sqrt;
var sin = Math.sin;
var cos = Math.cos;
var tan = Math.tan;
var asin = Math.asin;
var acos = Math.acos;
var atan = Math.atan;
var atan2 = Math.atan2;
var hypot = Math.hypot;
var degrees = function (x) {
	return (x * 180) / Math.PI;
};
var radians = function (x) {
	return (x * Math.PI) / 180;
};
var sinh = Math.sinh;
var cosh = Math.cosh;
var tanh = Math.tanh;
var asinh = Math.asinh;
var acosh = Math.acosh;
var atanh = Math.atanh;
var floor = Math.floor;
var ceil = Math.ceil;
var trunc = Math.trunc;
var isnan = isNaN;
var inf = Infinity;
var nan = NaN;
var modf = function (n) {
	var sign = (n >= 0 ? 1 : -(1));
	var __left0__ = divmod (abs (n), 1);
	var f = __left0__ [0];
	var mod = __left0__ [1];
	return tuple ([mod * sign, f * sign]);
};

var __module_math__ = /*#__PURE__*/Object.freeze({
    pi: pi,
    e: e,
    exp: exp,
    expm1: expm1,
    log: log,
    log1p: log1p,
    log2: log2,
    log10: log10,
    pow: pow$1,
    sqrt: sqrt,
    sin: sin,
    cos: cos,
    tan: tan,
    asin: asin,
    acos: acos,
    atan: atan,
    atan2: atan2,
    hypot: hypot,
    degrees: degrees,
    radians: radians,
    sinh: sinh,
    cosh: cosh,
    tanh: tanh,
    asinh: asinh,
    acosh: acosh,
    atanh: atanh,
    floor: floor,
    ceil: ceil,
    trunc: trunc,
    isnan: isnan,
    inf: inf,
    nan: nan,
    modf: modf
});

// Transcrypt'ed from Python, 2019-01-18 19:58:38
var math = {};
__nest__ (math, '', __module_math__);
var _array = (function () {
	var __accu0__ = [];
	for (var i = 0; i < 624; i++) {
		__accu0__.append (0);
	}
	return __accu0__;
}) ();
var _index = 0;
var _bitmask1 = Math.pow (2, 32) - 1;
var _bitmask2 = Math.pow (2, 31);
var _bitmask3 = Math.pow (2, 31) - 1;
var _fill_array = function () {
	for (var i = 0; i < 624; i++) {
		var y = (_array [i] & _bitmask2) + (_array [__mod__ (i + 1, 624)] & _bitmask3);
		_array [i] = _array [__mod__ (i + 397, 624)] ^ y >> 1;
		if (__mod__ (y, 2) != 0) {
			_array [i] ^= 2567483615;
		}
	}
};
var _random_integer = function () {
	if (_index == 0) {
		_fill_array ();
	}
	var y = _array [_index];
	y ^= y >> 11;
	y ^= y << 7 & 2636928640;
	y ^= y << 15 & 4022730752;
	y ^= y >> 18;
	_index = __mod__ (_index + 1, 624);
	return y;
};
var seed = function (x) {
	if (typeof x == 'undefined' || (x != null && x.hasOwnProperty ("__kwargtrans__"))) {		var x = int (_bitmask3 * Math.random ());
	}	_array [0] = x;
	for (var i = 1; i < 624; i++) {
		_array [i] = (1812433253 * _array [i - 1] ^ (_array [i - 1] >> 30) + i) & _bitmask1;
	}
};
var randint = function (a, b) {
	return a + __mod__ (_random_integer (), (b - a) + 1);
};
var choice = function (seq) {
	return seq [randint (0, len (seq) - 1)];
};
var random = function () {
	return _random_integer () / _bitmask3;
};
var shuffle = function (x) {
	for (var i = len (x) - 1; i > 0; i--) {
		var j = math.floor (random () * (i + 1));
		var temp = x [i];
		x [i] = x [j];
		x [j] = temp;
	}
};
seed ();

var __module_random__ = /*#__PURE__*/Object.freeze({
    _array: _array,
    get _index () { return _index; },
    _bitmask1: _bitmask1,
    _bitmask2: _bitmask2,
    _bitmask3: _bitmask3,
    _fill_array: _fill_array,
    _random_integer: _random_integer,
    seed: seed,
    randint: randint,
    choice: choice,
    random: random,
    shuffle: shuffle
});

// Transcrypt'ed from Python, 2019-01-18 19:58:38
var math$1 = {};
__nest__ (math$1, '', __module_math__);
var __name__$3 = 'battlecode';
var SPECS = dict ({'COMMUNICATION_BITS': 16, 'CASTLE_TALK_BITS': 8, 'MAX_ROUNDS': 1000, 'TRICKLE_FUEL': 25, 'INITIAL_KARBONITE': 100, 'INITIAL_FUEL': 500, 'MINE_FUEL_COST': 1, 'KARBONITE_YIELD': 2, 'FUEL_YIELD': 10, 'MAX_TRADE': 1024, 'MAX_BOARD_SIZE': 64, 'MAX_ID': 4096, 'CASTLE': 0, 'CHURCH': 1, 'PILGRIM': 2, 'CRUSADER': 3, 'PROPHET': 4, 'PREACHER': 5, 'RED': 0, 'BLUE': 1, 'CHESS_INITIAL': 100, 'CHESS_EXTRA': 20, 'TURN_MAX_TIME': 200, 'MAX_MEMORY': 50000000, 'UNITS': [dict ({'CONSTRUCTION_KARBONITE': null, 'CONSTRUCTION_FUEL': null, 'KARBONITE_CAPACITY': null, 'FUEL_CAPACITY': null, 'SPEED': 0, 'FUEL_PER_MOVE': null, 'STARTING_HP': 200, 'VISION_RADIUS': 100, 'ATTACK_DAMAGE': 10, 'ATTACK_RADIUS': [1, 64], 'ATTACK_FUEL_COST': 10, 'DAMAGE_SPREAD': 0}), dict ({'CONSTRUCTION_KARBONITE': 50, 'CONSTRUCTION_FUEL': 200, 'KARBONITE_CAPACITY': null, 'FUEL_CAPACITY': null, 'SPEED': 0, 'FUEL_PER_MOVE': null, 'STARTING_HP': 100, 'VISION_RADIUS': 100, 'ATTACK_DAMAGE': 0, 'ATTACK_RADIUS': 0, 'ATTACK_FUEL_COST': 0, 'DAMAGE_SPREAD': 0}), dict ({'CONSTRUCTION_KARBONITE': 10, 'CONSTRUCTION_FUEL': 50, 'KARBONITE_CAPACITY': 20, 'FUEL_CAPACITY': 100, 'SPEED': 4, 'FUEL_PER_MOVE': 1, 'STARTING_HP': 10, 'VISION_RADIUS': 100, 'ATTACK_DAMAGE': null, 'ATTACK_RADIUS': null, 'ATTACK_FUEL_COST': null, 'DAMAGE_SPREAD': null}), dict ({'CONSTRUCTION_KARBONITE': 15, 'CONSTRUCTION_FUEL': 50, 'KARBONITE_CAPACITY': 20, 'FUEL_CAPACITY': 100, 'SPEED': 9, 'FUEL_PER_MOVE': 1, 'STARTING_HP': 40, 'VISION_RADIUS': 49, 'ATTACK_DAMAGE': 10, 'ATTACK_RADIUS': [1, 16], 'ATTACK_FUEL_COST': 10, 'DAMAGE_SPREAD': 0}), dict ({'CONSTRUCTION_KARBONITE': 25, 'CONSTRUCTION_FUEL': 50, 'KARBONITE_CAPACITY': 20, 'FUEL_CAPACITY': 100, 'SPEED': 4, 'FUEL_PER_MOVE': 2, 'STARTING_HP': 20, 'VISION_RADIUS': 64, 'ATTACK_DAMAGE': 10, 'ATTACK_RADIUS': [16, 64], 'ATTACK_FUEL_COST': 25, 'DAMAGE_SPREAD': 0}), dict ({'CONSTRUCTION_KARBONITE': 30, 'CONSTRUCTION_FUEL': 50, 'KARBONITE_CAPACITY': 20, 'FUEL_CAPACITY': 100, 'SPEED': 4, 'FUEL_PER_MOVE': 3, 'STARTING_HP': 60, 'VISION_RADIUS': 16, 'ATTACK_DAMAGE': 20, 'ATTACK_RADIUS': [1, 16], 'ATTACK_FUEL_COST': 15, 'DAMAGE_SPREAD': 3})]});
var BCAbstractRobot =  __class__ ('BCAbstractRobot', [object], {
	__module__: __name__$3,
	get __init__ () {return __get__ (this, function (self) {
		self._bc_reset_state ();
	});},
	get _do_turn () {return __get__ (this, function (self, game_state) {
		self._bc_game_state = game_state;
		self.id = game_state ['id'];
		self.karbonite = game_state ['karbonite'];
		self.fuel = game_state ['fuel'];
		self.last_offer = game_state ['last_offer'];
		self.me = self.get_robot (self.id);
		if (self.me.turn == 1) {
			self.map = game_state ['map'];
			self.karbonite_map = game_state ['karbonite_map'];
			self.fuel_map = game_state ['fuel_map'];
		}
		try {
			var t = self.turn ();
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				var e$$1 = __except0__;
				var t = self._bc_error_action (e$$1);
			}
			else {
				throw __except0__;
			}
		}
		if (!(t)) {
			var t = self._bc_null_action ();
		}
		t ['signal'] = self._bc_signal;
		t ['signal_radius'] = self._bc_signal_radius;
		t ['logs'] = self._bc_logs;
		t ['castle_talk'] = self._bc_castle_talk;
		self._bc_reset_state ();
		return t;
	});},
	get _bc_reset_state () {return __get__ (this, function (self) {
		self._bc_logs = [];
		self._bc_signal = 0;
		self._bc_signal_radius = 0;
		self._bc_game_state = null;
		self._bc_castle_talk = 0;
		self.me = null;
		self.id = null;
		self.fuel = null;
		self.karbonite = null;
		self.last_offer = null;
	});},
	get _bc_null_action () {return __get__ (this, function (self) {
		return dict ({'signal': self._bc_signal, 'signal_radius': self._bc_signal_radius, 'logs': self._bc_logs, 'castle_talk': self._bc_castle_talk});
	});},
	get _bc_error_action () {return __get__ (this, function (self, e$$1) {
		var a = self._bc_null_action ();
		a ['error'] = str (e$$1);
		return a;
	});},
	get _bc_action () {return __get__ (this, function (self, action, properties) {
		if (typeof properties == 'undefined' || (properties != null && properties.hasOwnProperty ("__kwargtrans__"))) {			var properties = null;
		}		var a = self._bc_null_action ();
		if (properties) {
			for (var key of properties.py_keys ()) {
				a [key] = properties [key];
			}
		}
		a ['action'] = action;
		return a;
	});},
	get _bc_check_on_map () {return __get__ (this, function (self, x, y) {
		return x >= 0 && x < len (self._bc_game_state ['shadow'] [0]) && y >= 0 && y < len (self._bc_game_state ['shadow']);
	});},
	get log () {return __get__ (this, function (self, message) {
		self._bc_logs.append (str (message));
	});},
	get signal () {return __get__ (this, function (self, value, radius) {
		if (self.fuel < math$1.ceil (math$1.sqrt (radius))) {
			var __except0__ = Exception ('Not enough fuel to signal given radius.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (value < 0 || value >= Math.pow (2, SPECS ['COMMUNICATION_BITS'])) {
			var __except0__ = Exception ('Invalid signal, must be int within bit range.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (radius > 2 * Math.pow (SPECS ['MAX_BOARD_SIZE'] - 1, 2)) {
			var __except0__ = Exception ('Signal radius is too big.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		self._bc_signal = value;
		self._bc_signal_radius = radius;
		self.fuel -= radius;
	});},
	get castle_talk () {return __get__ (this, function (self, value) {
		if (value < 0 || value >= Math.pow (2, SPECS ['CASTLE_TALK_BITS'])) {
			var __except0__ = Exception ('Invalid castle talk, must be between 0 and 2^8.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		self._bc_castle_talk = value;
	});},
	get propose_trade () {return __get__ (this, function (self, karbonite, fuel) {
		if (self.me ['unit'] != SPECS ['CASTLE']) {
			var __except0__ = Exception ('Only castles can trade.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (abs (karbonite) >= SPECS ['MAX_TRADE'] || abs (fuel) >= SPECS ['MAX_TRADE']) {
			var __except0__ = Exception (('Cannot trade over ' + str (SPECS ['MAX_TRADE'])) + ' in a given turn.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return self._bc_action ('trade', dict ({'trade_fuel': fuel, 'trade_karbonite': karbonite}));
	});},
	get build_unit () {return __get__ (this, function (self, unit, dx, dy) {
		if (self.me ['unit'] != SPECS ['PILGRIM'] && self.me ['unit'] != SPECS ['CASTLE'] && self.me ['unit'] != SPECS ['CHURCH']) {
			var __except0__ = Exception ('This unit type cannot build.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (self.me ['unit'] == SPECS ['PILGRIM'] && unit != SPECS ['CHURCH']) {
			var __except0__ = Exception ('Pilgrims can only build churches.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (self.me ['unit'] != SPECS ['PILGRIM'] && unit == SPECS ['CHURCH']) {
			var __except0__ = Exception ('Only pilgrims can build churches.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (dx < -(1) || dy < -(1) || dx > 1 || dy > 1) {
			var __except0__ = Exception ('Can only build in adjacent squares.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (!(self._bc_check_on_map (self.me ['x'] + dx, self.me ['y'] + dy))) {
			var __except0__ = Exception ("Can't build units off of map.");
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (self._bc_game_state ['shadow'] [self.me ['y'] + dy] [self.me ['x'] + dx] != 0) {
			var __except0__ = Exception ('Cannot build on occupied tile.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (!(self.map [self.me ['y'] + dy] [self.me ['x'] + dx])) {
			var __except0__ = Exception ('Cannot build onto impassable terrain.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (self.karbonite < SPECS ['UNITS'] [unit] ['CONSTRUCTION_KARBONITE'] || self.fuel < SPECS ['UNITS'] [unit] ['CONSTRUCTION_FUEL']) {
			var __except0__ = Exception ('Cannot afford to build specified unit.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return self._bc_action ('build', dict ({'dx': dx, 'dy': dy, 'build_unit': unit}));
	});},
	get move () {return __get__ (this, function (self, dx, dy) {
		if (self.me ['unit'] == SPECS ['CASTLE'] || self.me ['unit'] == SPECS ['CHURCH']) {
			var __except0__ = Exception ('Churches and Castles cannot move.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (!(self._bc_check_on_map (self.me ['x'] + dx, self.me ['y'] + dy))) {
			var __except0__ = Exception ("Can't move off of map.");
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (self._bc_game_state.shadow [self.me ['y'] + dy] [self.me ['x'] + dx] == -(1)) {
			var __except0__ = Exception ('Cannot move outside of vision range.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (self._bc_game_state.shadow [self.me ['y'] + dy] [self.me ['x'] + dx] != 0) {
			var __except0__ = Exception ('Cannot move onto occupied tile.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (!(self.map [self.me ['y'] + dy] [self.me ['x'] + dx])) {
			var __except0__ = Exception ('Cannot move onto impassable terrain.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		var r = Math.pow (dx, 2) + Math.pow (dy, 2);
		if (r > SPECS ['UNITS'] [self.me ['unit']] ['SPEED']) {
			var __except0__ = Exception ('Slow down, cowboy.  Tried to move faster than unit can.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (self.fuel < r * SPECS ['UNITS'] [self.me ['unit']] ['FUEL_PER_MOVE']) {
			var __except0__ = Exception ('Not enough fuel to move at given speed.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return self._bc_action ('move', dict ({'dx': dx, 'dy': dy}));
	});},
	get mine () {return __get__ (this, function (self) {
		if (self.me ['unit'] != SPECS ['PILGRIM']) {
			var __except0__ = Exception ('Only Pilgrims can mine.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (self.fuel < SPECS ['MINE_FUEL_COST']) {
			var __except0__ = Exception ('Not enough fuel to mine.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (self.karbonite_map [self.me ['y']] [self.me ['x']]) {
			if (self.me ['karbonite'] >= SPECS ['UNITS'] [SPECS ['PILGRIM']] ['KARBONITE_CAPACITY']) {
				var __except0__ = Exception ('Cannot mine, as at karbonite capacity.');
				__except0__.__cause__ = null;
				throw __except0__;
			}
		}
		else if (self.fuel_map [self.me ['y']] [self.me ['x']]) {
			if (self.me ['fuel'] >= SPECS ['UNITS'] [SPECS ['PILGRIM']] ['FUEL_CAPACITY']) {
				var __except0__ = Exception ('Cannot mine, as at fuel capacity.');
				__except0__.__cause__ = null;
				throw __except0__;
			}
		}
		else {
			var __except0__ = Exception ('Cannot mine square without fuel or karbonite.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return self._bc_action ('mine');
	});},
	get give () {return __get__ (this, function (self, dx, dy, karbonite, fuel) {
		if (dx > 1 || dx < -(1) || dy > 1 || dy < -(1) || dx == 0 && dy == 0) {
			var __except0__ = Exception ('Can only give to adjacent squares.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (!(self._bc_check_on_map (self.me ['x'] + dx, self.me ['y'] + dy))) {
			var __except0__ = Exception ("Can't give off of map.");
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (self._bc_game_state ['shadow'] [self.me ['y'] + dy] [self.me ['x'] + dx] <= 0) {
			var __except0__ = Exception ('Cannot give to empty square.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (karbonite < 0 || fuel < 0 || self.me ['karbonite'] < karbonite || self.me ['fuel'] < fuel) {
			var __except0__ = Exception ('Do not have specified amount to give.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return self._bc_action ('give', dict ({'dx': dx, 'dy': dy, 'give_karbonite': karbonite, 'give_fuel': fuel}));
	});},
	get attack () {return __get__ (this, function (self, dx, dy) {
		if (self.me ['unit'] == SPECS ['CHURCH']) {
			var __except0__ = Exception ('Given unit cannot attack.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (self.fuel < SPECS ['UNITS'] [self.me ['unit']] ['ATTACK_FUEL_COST']) {
			var __except0__ = Exception ('Not enough fuel to attack.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (!(self._bc_check_on_map (self.me ['x'] + dx, self.me ['y'] + dy))) {
			var __except0__ = Exception ("Can't attack off of map.");
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (self._bc_game_state ['shadow'] [self.me ['y'] + dy] [self.me ['x'] + dx] == -(1)) {
			var __except0__ = Exception ('Cannot attack outside of vision range.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		var r = Math.pow (dx, 2) + Math.pow (dy, 2);
		if (r > SPECS ['UNITS'] [self.me ['unit']] ['ATTACK_RADIUS'] [1] || r < SPECS ['UNITS'] [self.me ['unit']] ['ATTACK_RADIUS'] [0]) {
			var __except0__ = Exception ('Cannot attack outside of attack range.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return self._bc_action ('attack', dict ({'dx': dx, 'dy': dy}));
	});},
	get get_robot () {return __get__ (this, function (self, id) {
		if (id <= 0) {
			return null;
		}
		for (var robot of self._bc_game_state ['visible']) {
			if (robot ['id'] == id) {
				return robot;
			}
		}
		return null;
	});},
	get is_visible () {return __get__ (this, function (self, robot) {
		var x = __in__ ('unit', robot);
		return x;
	});},
	get is_radioing () {return __get__ (this, function (self, robot) {
		return robot ['signal'] >= 0;
	});},
	get get_visible_robot_map () {return __get__ (this, function (self) {
		return self._bc_game_state ['shadow'];
	});},
	get get_passable_map () {return __get__ (this, function (self) {
		return self.map;
	});},
	get get_karbonite_map () {return __get__ (this, function (self) {
		return self.karbonite_map;
	});},
	get get_fuel_map () {return __get__ (this, function (self) {
		return self.fuel_map;
	});},
	get get_visible_robots () {return __get__ (this, function (self) {
		return self._bc_game_state ['visible'];
	});},
	get turn () {return __get__ (this, function (self) {
		return null;
	});}
});

// Transcrypt'ed from Python, 2019-01-18 19:58:38
var random$1 = {};
__nest__ (random$1, '', __module_random__);
var __name__$4 = '__main__';
var MyRobot =  __class__ ('MyRobot', [BCAbstractRobot], {
	__module__: __name__$4,
	full: false,
	ranges: dict ({'4': [[1, 1], [__neg__ (1), __neg__ (1)], [__neg__ (1), 1], [1, __neg__ (1)], [0, 1], [1, 0], [0, __neg__ (1)], [__neg__ (1), 0], [2, 0], [__neg__ (2), 0], [0, 2], [0, __neg__ (2)]], '9': [[3, 0], [__neg__ (3), 0], [0, 3], [0, __neg__ (3)], [2, 1], [__neg__ (2), 1], [__neg__ (2), __neg__ (1)], [2, __neg__ (1)], [1, 2], [__neg__ (1), 2], [__neg__ (1), __neg__ (2)], [1, __neg__ (2)], [2, 2], [__neg__ (2), __neg__ (2)], [__neg__ (2), 2], [2, __neg__ (2)], [1, 1], [__neg__ (1), __neg__ (1)], [__neg__ (1), 1], [1, __neg__ (1)], [0, 1], [1, 0], [0, __neg__ (1)], [__neg__ (1), 0], [2, 0], [__neg__ (2), 0], [0, 2], [0, __neg__ (2)]]}),
	myPath: [],
	spawn_castle: [],
	found_karbonite: [],
	found_fuel: [],
	found_karbonite_heuristic: [],
	found_fuel_heuristic: [],
	ignore_xy: [],
	unit_counts: dict ({'PILGRIM': 0, 'CRUSADER': 0}),
	robotSpawn: __neg__ (1),
	first_castle: true,
	enemy_castle_locations: [],
	symmetry: [],
	my_castle_locations: [],
	visited_points: [],
	way_points: [],
	already_signaled: false,
	someone_signaled: false,
	get turn () {return __get__ (this, function (self) {
		var myX = __getitem__ (self.me, 'x');
		var myY = __getitem__ (self.me, 'y');
		var choices = [tuple ([0, 1]), tuple ([1, 0]), tuple ([__neg__ (1), 0]), tuple ([0, __neg__ (1)]), tuple ([__neg__ (1), __neg__ (1)]), tuple ([__neg__ (1), 1]), tuple ([1, __neg__ (1)]), tuple ([1, 1])];
		var occupied = [];
		var __iterable0__ = (function () {
			var __accu0__ = self;
			return __call__ (__accu0__.get_visible_robots, __accu0__);
		}) ();
		__iterable0__ = __i__ (__iterable0__);
		for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
			var robot = __getitem__ (__iterable0__, __index0__);
			if (__t__ (__ne__ (tuple ([robot.x, robot.y]), tuple ([myX, myY])))) {
				(function () {
					var __accu0__ = occupied;
					return __call__ (__accu0__.append, __accu0__, tuple ([robot.x, robot.y]));
				}) ();
			}
		}
		if (__t__ (__eq__ (__getitem__ (self.me, 'unit'), __getitem__ (SPECS, 'CASTLE')))) {
			if (__t__ (__eq__ (self.robotSpawn, __neg__ (1)))) {
				self.robotSpawn = 0;
			}
			var __iterable0__ = (function () {
				var __accu0__ = self;
				return __call__ (__accu0__.get_visible_robots, __accu0__);
			}) ();
			__iterable0__ = __i__ (__iterable0__);
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var robot = __getitem__ (__iterable0__, __index0__);
				if (__t__ (__t__ (__eq__ (__getitem__ (self.me, 'team'), robot.team)) && __ne__ (tuple ([robot.x, robot.y]), tuple ([myX, myY])))) {
					if (__t__ (__eq__ (robot.turn, __getitem__ (self.me, 'turn')))) {
						self.first_castle = false;
					}
					if (__t__ (__t__ (__ne__ (robot.castle_talk, 0)) && __lt__ (__call__ (len, null, self.my_castle_locations), 2))) {
						self.my_castle_locations = __call__ (__iadd__, null, self.my_castle_locations, (function () {
							var __accu0__ = self;
							return __call__ (__accu0__.convert_compressed_signal, __accu0__, robot.castle_talk);
						}) ());
					}
				}
			}
			if (__t__ (!__t__ ((self.first_castle)))) {
				if (__t__ (!__t__ ((self.already_signaled)))) {
					self.already_signaled = true;
					(function () {
						var __accu0__ = self;
						return __call__ (__accu0__.castle_talk, __accu0__, (function () {
							var __accu1__ = self;
							return __call__ (__accu1__.compress_coordinates, __accu1__, [tuple ([myX, myY])]);
						}) ());
					}) ();
				}
				return (function () {
					var __accu0__ = self;
					return __call__ (__accu0__.if_visible_attack, __accu0__, myX, myY);
				}) ();
			}
			var __break0__ = false;
			var __iterable0__ = choices;
			__iterable0__ = __i__ (__iterable0__);
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var __left0__ = __getitem__ (__iterable0__, __index0__);
				var dx = __left0__ [0];
				var dy = __left0__ [1];
				var newX = __add__ (myX, dx);
				var newY = __add__ (myY, dy);
				if (__t__ (__t__ ((function () {
					var __accu0__ = self;
					return __call__ (__accu0__.check_valid_square, __accu0__, newX, newY, occupied);
				}) ()) && __t__ (__ge__ (self.karbonite, 15)) && self.first_castle)) {
					(function () {
						var __accu0__ = self;
						return __call__ (__accu0__.log, __accu0__, 'PIZZA TIME!');
					}) ();
					return (function () {
						var __accu0__ = self;
						return __call__ (__accu0__.build_unit, __accu0__, __getitem__ (SPECS, 'CRUSADER'), dx, dy);
					}) ();
				}
			}
			if (!__break0__) {
				if (__t__ (!__t__ ((self.already_signaled)))) {
					(function () {
						var __accu0__ = self;
						return __call__ (__accu0__.log, __accu0__, 'GO TIME!');
					}) ();
					(function () {
						var __accu0__ = self;
						return __call__ (__accu0__.log, __accu0__, self.my_castle_locations);
					}) ();
					var coords = (function () {
						var __accu0__ = self;
						return __call__ (__accu0__.find_enemy_castles, __accu0__);
					}) ();
					var signal = (function () {
						var __accu0__ = self;
						return __call__ (__accu0__.compress_coordinates, __accu0__, coords);
					}) ();
					(function () {
						var __accu0__ = self;
						return __call__ (__accu0__.signal, __accu0__, signal, 4);
					}) ();
					self.already_signaled = true;
				}
				return (function () {
					var __accu0__ = self;
					return __call__ (__accu0__.if_visible_attack, __accu0__, myX, myY);
				}) ();
			}
		}
		else if (__t__ (__eq__ (__getitem__ (self.me, 'unit'), __getitem__ (SPECS, 'PILGRIM')))) {
			if (__t__ (__eq__ (self.robotSpawn, __neg__ (1)))) {
				var __iterable0__ = (function () {
					var __accu0__ = self;
					return __call__ (__accu0__.get_visible_robots, __accu0__);
				}) ();
				__iterable0__ = __i__ (__iterable0__);
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var r = __getitem__ (__iterable0__, __index0__);
					if (__t__ (__t__ ((function () {
						var __accu0__ = self;
						return __call__ (__accu0__.is_radioing, __accu0__, r);
					}) ()) && __t__ (__eq__ (__getitem__ (r, 'unit'), __getitem__ (SPECS, 'CASTLE'))) && __t__ (__eq__ (__getitem__ (r, 'team'), __getitem__ (self.me, 'team'))) && __t__ (__lt__ (__call__ (abs, null, __sub__ (r.x, myX)), 2)) && __lt__ (__call__ (abs, null, __sub__ (r.y, myY)), 2))) {
						self.robotSpawn = r.signal;
						var castleX = r.x;
						var castleY = r.y;
					}
				}
			}
			(function () {
				var __accu0__ = self;
				return __call__ (__accu0__.castle_talk, __accu0__, self.robotSpawn);
			}) ();
			if (__t__ (__eq__ (self.full, true))) {
				var __iterable0__ = (function () {
					var __accu0__ = self;
					return __call__ (__accu0__.get_visible_robots, __accu0__);
				}) ();
				__iterable0__ = __i__ (__iterable0__);
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var robot = __getitem__ (__iterable0__, __index0__);
					if (__t__ (__t__ (__eq__ (robot.unit, __getitem__ (SPECS, 'CASTLE'))) && __eq__ (robot.team, __getitem__ (self.me, 'team')))) {
						var __left0__ = tuple ([__sub__ (robot.x, myX), __sub__ (robot.y, myY)]);
						var dx = __left0__ [0];
						var dy = __left0__ [1];
						if (__t__ (__t__ ((__lt__ (__neg__ (2), dx) && __lt__ (dx, 2))) && (__lt__ (__neg__ (2), dy) && __lt__ (dy, 2)))) {
							self.full = false;
							self.myPath = [];
							return (function () {
								var __accu0__ = self;
								return __call__ (__accu0__.give, __accu0__, dx, dy, self.me.karbonite, self.me.fuel);
							}) ();
						}
					}
				}
			}
			if (__t__ (__eq__ (self.spawn_castle, []))) {
				var __iterable0__ = (function () {
					var __accu0__ = self;
					return __call__ (__accu0__.get_visible_robots, __accu0__);
				}) ();
				__iterable0__ = __i__ (__iterable0__);
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var robot = __getitem__ (__iterable0__, __index0__);
					if (__t__ (__t__ ((__t__ (__eq__ (robot.unit, __getitem__ (SPECS, 'CASTLE'))) || __eq__ (robot.unit, __getitem__ (SPECS, 'CHURCH')))) && __eq__ (robot.team, __getitem__ (self.me, 'team')))) {
						if (__t__ (__t__ ((__lt__ (__neg__ (2), __sub__ (robot.x, myX)) && __lt__ (__sub__ (robot.x, myX), 2))) && (__lt__ (__neg__ (2), __sub__ (robot.y, myY)) && __lt__ (__sub__ (robot.y, myY), 2)))) {
							self.spawn_castle = tuple ([robot.x, robot.y]);
						}
					}
				}
			}
			var __left0__ = tuple ([__getitem__ (self.spawn_castle, 0), __getitem__ (self.spawn_castle, 1)]);
			var X = __left0__ [0];
			var Y = __left0__ [1];
			if (__t__ (__eq__ (self.found_karbonite, []))) {
				var __iterable0__ = __call__ (enumerate, null, self.karbonite_map);
				__iterable0__ = __i__ (__iterable0__);
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var __left0__ = __getitem__ (__iterable0__, __index0__);
					var y = __left0__ [0];
					var col = __left0__ [1];
					var __iterable1__ = __call__ (enumerate, null, col);
					__iterable1__ = __i__ (__iterable1__);
					for (var __index1__ = 0; __index1__ < len (__iterable1__); __index1__++) {
						var __left0__ = __getitem__ (__iterable1__, __index1__);
						var x = __left0__ [0];
						var item = __left0__ [1];
						if (__t__ (item)) {
							self.found_karbonite = __call__ (__iadd__, null, self.found_karbonite, [tuple ([x, y])]);
						}
					}
				}
				var __iterable0__ = self.found_karbonite;
				__iterable0__ = __i__ (__iterable0__);
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var i = __getitem__ (__iterable0__, __index0__);
					self.found_karbonite_heuristic = __call__ (__iadd__, null, self.found_karbonite_heuristic, [(function () {
						var __accu0__ = self;
						return __call__ (__accu0__.heuristic, __accu0__, X, Y, __getitem__ (i, 0), __getitem__ (i, 1));
					}) ()]);
				}
			}
			if (__t__ (__eq__ (self.found_fuel, []))) {
				var __iterable0__ = __call__ (enumerate, null, self.fuel_map);
				__iterable0__ = __i__ (__iterable0__);
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var __left0__ = __getitem__ (__iterable0__, __index0__);
					var y = __left0__ [0];
					var col = __left0__ [1];
					var __iterable1__ = __call__ (enumerate, null, col);
					__iterable1__ = __i__ (__iterable1__);
					for (var __index1__ = 0; __index1__ < len (__iterable1__); __index1__++) {
						var __left0__ = __getitem__ (__iterable1__, __index1__);
						var x = __left0__ [0];
						var item = __left0__ [1];
						if (__t__ (item)) {
							self.found_fuel = __call__ (__iadd__, null, self.found_fuel, [tuple ([x, y])]);
						}
					}
				}
				var __iterable0__ = self.found_fuel;
				__iterable0__ = __i__ (__iterable0__);
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var i = __getitem__ (__iterable0__, __index0__);
					self.found_fuel_heuristic = __call__ (__iadd__, null, self.found_fuel_heuristic, [(function () {
						var __accu0__ = self;
						return __call__ (__accu0__.heuristic, __accu0__, X, Y, __getitem__ (i, 0), __getitem__ (i, 1));
					}) ()]);
				}
			}
			if (__t__ (__ne__ (self.myPath, []))) {
				var m = (function () {
					var __accu0__ = self;
					return __call__ (__accu0__.movenext, __accu0__, myX, myY, occupied);
				}) ();
				if (__t__ (!__t__ ((m)))) {
					if (__t__ (self.full)) {
						var __left0__ = tuple ([__getitem__ (self.spawn_castle, 0), __getitem__ (self.spawn_castle, 1)]);
						var X = __left0__ [0];
						var Y = __left0__ [1];
						var distance_sq_choices = (function () {
							var __accu0__ = [];
							var __iterable0__ = choices;
							__iterable0__ = __i__ (__iterable0__);
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var __left0__ = __getitem__ (__iterable0__, __index0__);
								var dx = __left0__ [0];
								var dy = __left0__ [1];
								(function () {
									var __accu1__ = __accu0__;
									return __call__ (__accu1__.append, __accu1__, tuple ([__add__ (__pow__ (__sub__ (__sub__ (myX, X), dx), 2), __pow__ (__sub__ (__sub__ (myY, Y), dy), 2)), dx, dy]));
								}) ();
							}
							return __accu0__;
						}) ();
						var __iterable0__ = __call__ (sorted, null, distance_sq_choices);
						__iterable0__ = __i__ (__iterable0__);
						for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
							var __left0__ = __getitem__ (__iterable0__, __index0__);
							var distance_sq_choices = __left0__ [0];
							var dx = __left0__ [1];
							var dy = __left0__ [2];
							if (__t__ (!__t__ (((function () {
								var __accu0__ = self;
								return __call__ (__accu0__.check_valid_square, __accu0__, __add__ (X, dx), __add__ (Y, dy), occupied);
							}) ())))) {
								break;
							}
							else {
								self.myPath = (function () {
									var __accu0__ = self;
									return __call__ (__accu0__.pathfindsteps, __accu0__, myX, myY, __add__ (X, dx), __add__ (Y, dy), [], []);
								}) ();
								return (function () {
									var __accu0__ = self;
									return __call__ (__accu0__.movenext, __accu0__, myX, myY, occupied);
								}) ();
							}
						}
					}
					else {
						self.myPath = [];
					}
				}
				return m;
			}
			else if (__t__ (__t__ (__getitem__ (__getitem__ (self.karbonite_map, myY), myX)) || __getitem__ (__getitem__ (self.fuel_map, myY), myX))) {
				if (__t__ (__t__ (__eq__ (self.me.fuel, 100)) || __eq__ (self.me.karbonite, 20))) {
					self.full = true;
					var __left0__ = tuple ([__getitem__ (self.spawn_castle, 0), __getitem__ (self.spawn_castle, 1)]);
					var X = __left0__ [0];
					var Y = __left0__ [1];
					var distance_sq_choices = (function () {
						var __accu0__ = [];
						var __iterable0__ = choices;
						__iterable0__ = __i__ (__iterable0__);
						for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
							var __left0__ = __getitem__ (__iterable0__, __index0__);
							var dx = __left0__ [0];
							var dy = __left0__ [1];
							(function () {
								var __accu1__ = __accu0__;
								return __call__ (__accu1__.append, __accu1__, tuple ([__add__ (__pow__ (__sub__ (__sub__ (myX, X), dx), 2), __pow__ (__sub__ (__sub__ (myY, Y), dy), 2)), dx, dy]));
							}) ();
						}
						return __accu0__;
					}) ();
					var __iterable0__ = __call__ (sorted, null, distance_sq_choices);
					__iterable0__ = __i__ (__iterable0__);
					for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
						var __left0__ = __getitem__ (__iterable0__, __index0__);
						var distance_sq_choices = __left0__ [0];
						var dx = __left0__ [1];
						var dy = __left0__ [2];
						if (__t__ (!__t__ (((function () {
							var __accu0__ = self;
							return __call__ (__accu0__.check_valid_square, __accu0__, __add__ (X, dx), __add__ (Y, dy), occupied);
						}) ())))) {
							break;
						}
						else {
							self.myPath = (function () {
								var __accu0__ = self;
								return __call__ (__accu0__.pathfindsteps, __accu0__, myX, myY, __add__ (X, dx), __add__ (Y, dy), [], []);
							}) ();
							return (function () {
								var __accu0__ = self;
								return __call__ (__accu0__.movenext, __accu0__, myX, myY, occupied);
							}) ();
						}
					}
				}
				return (function () {
					var __accu0__ = self;
					return __call__ (__accu0__.mine, __accu0__);
				}) ();
			}
			else {
				var ignore = self.robotSpawn;
				var fuel_check = false;
				var karbonite_check = true;
				var found_fuel_heuristic = __getslice__ (self.found_fuel_heuristic, 0, null, 1);
				var found_karbonite_heuristic = __getslice__ (self.found_karbonite_heuristic, 0, null, 1);
				var ignore_k = 0;
				var ignore_f = 0;
				if (__t__ (__ge__ (self.robotSpawn, 2))) {
					var fuel_check = true;
					var ignore_k = 2;
				}
				if (__t__ (__eq__ (fuel_check, karbonite_check))) {
					var count = __add__ (__call__ (len, null, self.found_fuel), __call__ (len, null, self.found_karbonite));
					var found = __add__ (self.found_karbonite, self.found_fuel);
					var found_heuristic = __add__ (found_karbonite_heuristic, found_fuel_heuristic);
				}
				else if (__t__ (fuel_check)) {
					var count = __call__ (len, null, self.found_fuel);
					var found = __getslice__ (self.found_fuel, 0, null, 1);
					var found_heuristic = found_fuel_heuristic;
				}
				else {
					var count = __call__ (len, null, self.found_karbonite);
					var found = __getslice__ (self.found_karbonite, 0, null, 1);
					var found_heuristic = found_karbonite_heuristic;
				}
				while (__t__ (__gt__ (count, 0))) {
					var min_index = (function () {
						var __accu0__ = found_heuristic;
						return __call__ (__accu0__.index, __accu0__, __call__ (min, null, found_heuristic));
					}) ();
					__setitem__ (found_heuristic, min_index, 69696996969);
					var __left0__ = __getitem__ (found, min_index);
					var x = __left0__ [0];
					var y = __left0__ [1];
					if (__t__ (__t__ (__t__ (__eq__ (ignore, 0)) && (__t__ (__getitem__ (__getitem__ (self.karbonite_map, y), x)) && __le__ (ignore_k, 0))) || __t__ (__le__ (ignore_f, 0)) && __getitem__ (__getitem__ (self.fuel_map, y), x))) {
						var __break1__ = false;
						var __iterable0__ = (function () {
							var __accu0__ = self;
							return __call__ (__accu0__.get_visible_robots, __accu0__);
						}) ();
						__iterable0__ = __i__ (__iterable0__);
						for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
							var r = __getitem__ (__iterable0__, __index0__);
							if (__t__ (__eq__ (tuple ([r.x, r.y]), __getitem__ (found, min_index)))) {
								if (__t__ (__t__ (__eq__ (r.team, __getitem__ (self.me, 'team'))) && __eq__ (r.unit, __getitem__ (self.me, 'unit')))) {
									var ignore = 1;
									__break1__ = true;
									break;
								}
							}
						}
						if (!__break1__) {
							self.myPath = (function () {
								var __accu0__ = self;
								return __call__ (__accu0__.pathfindsteps, __accu0__, myX, myY, __getitem__ (__getitem__ (found, min_index), 0), __getitem__ (__getitem__ (found, min_index), 1), [], []);
							}) ();
							return (function () {
								var __accu0__ = self;
								return __call__ (__accu0__.movenext, __accu0__, myX, myY, occupied);
							}) ();
						}
					}
					var ignore = __call__ (__isub__, null, ignore, 1);
					if (__t__ (__getitem__ (__getitem__ (self.karbonite_map, y), x))) {
						var ignore_k = __call__ (__isub__, null, ignore_k, 1);
					}
					if (__t__ (__getitem__ (__getitem__ (self.fuel_map, y), x))) {
						var ignore_f = __call__ (__isub__, null, ignore_f, 1);
					}
					var count = __call__ (__isub__, null, count, 1);
				}
			}
		}
		else if (__t__ (__eq__ (__getitem__ (SPECS, 'CRUSADER'), __getitem__ (self.me, 'unit')))) {
			var myX = __getitem__ (self.me, 'x');
			var myY = __getitem__ (self.me, 'y');
			var ret = (function () {
				var __accu0__ = self;
				return __call__ (__accu0__.if_visible_attack, __accu0__, myX, myY);
			}) ();
			if (__t__ (__ne__ (ret, false))) {
				return ret;
			}
			var __iterable0__ = (function () {
				var __accu0__ = self;
				return __call__ (__accu0__.get_visible_robots, __accu0__);
			}) ();
			__iterable0__ = __i__ (__iterable0__);
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var robot = __getitem__ (__iterable0__, __index0__);
				if (__t__ (__t__ (__ne__ (robot.signal, __neg__ (1))) && __eq__ (__getitem__ (self.me, 'team'), robot.team))) {
					if (__t__ (__eq__ (robot.unit, __getitem__ (SPECS, 'CASTLE')))) {
						(function () {
							var __accu0__ = self;
							return __call__ (__accu0__.log, __accu0__, robot.signal);
						}) ();
						var coords = (function () {
							var __accu0__ = self;
							return __call__ (__accu0__.convert_compressed_signal, __accu0__, robot.signal);
						}) ();
						var coords = (function () {
							var __accu0__ = [];
							var __iterable1__ = coords;
							__iterable1__ = __i__ (__iterable1__);
							for (var __index1__ = 0; __index1__ < len (__iterable1__); __index1__++) {
								var i = __getitem__ (__iterable1__, __index1__);
								if (__t__ (__ne__ (i, tuple ([0, 0])))) {
									(function () {
										var __accu1__ = __accu0__;
										return __call__ (__accu1__.append, __accu1__, i);
									}) ();
								}
							}
							return __accu0__;
						}) ();
						self.symmetry = (function () {
							var __accu0__ = self;
							return __call__ (__accu0__.find_symmetry, __accu0__);
						}) ();
						var coords = __add__ ([(function () {
							var __accu0__ = self;
							return __call__ (__accu0__.reflect, __accu0__, robot.x, robot.y, __getitem__ (self.symmetry, 1), __getitem__ (self.symmetry, 0));
						}) ()], coords);
						var r = [];
						var __iterable1__ = coords;
						__iterable1__ = __i__ (__iterable1__);
						for (var __index1__ = 0; __index1__ < len (__iterable1__); __index1__++) {
							var __left0__ = __getitem__ (__iterable1__, __index1__);
							var x = __left0__ [0];
							var y = __left0__ [1];
							(function () {
								var __accu0__ = r;
								return __call__ (__accu0__.append, __accu0__, (function () {
									var __accu1__ = self;
									return __call__ (__accu1__.fix_approximation, __accu1__, x, y, 4);
								}) ());
							}) ();
						}
						(function () {
							var __accu0__ = self;
							return __call__ (__accu0__.log, __accu0__, __add__ ('ENEMY CASTLES', __call__ (str, null, r)));
						}) ();
						self.way_points = r;
					}
					if (__t__ (__t__ (__eq__ (robot.signal, 1)) && __eq__ (robot.unit, __getitem__ (SPECS, 'CRUSADER')))) {
						self.myPath = [];
						break;
					}
				}
			}
			if (__t__ (__eq__ (self.myPath, []))) {
				var __iterable0__ = self.way_points;
				__iterable0__ = __i__ (__iterable0__);
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var point = __getitem__ (__iterable0__, __index0__);
					var __break1__ = false;
					var __iterable1__ = self.visited_points;
					__iterable1__ = __i__ (__iterable1__);
					for (var __index1__ = 0; __index1__ < len (__iterable1__); __index1__++) {
						var visited_point = __getitem__ (__iterable1__, __index1__);
						if (__t__ (__eq__ (visited_point, point))) {
							__break1__ = true;
							break;
						}
					}
					if (!__break1__) {
						(function () {
							var __accu0__ = self.visited_points;
							return __call__ (__accu0__.append, __accu0__, point);
						}) ();
						var fixed = (function () {
							var __accu0__ = self;
							return __call__ (__accu0__.fix_approximation, __accu0__, __getitem__ (point, 0), __getitem__ (point, 1), 4);
						}) ();
						self.myPath = __getslice__ ((function () {
							var __accu0__ = self;
							return __call__ (__accu0__.pathfindsteps, __accu0__, myX, myY, __getitem__ (fixed, 0), __getitem__ (fixed, 1), [], occupied);
						}) (), 0, __neg__ (1), 1);
						(function () {
							var __accu0__ = self;
							return __call__ (__accu0__.log, __accu0__, self.myPath);
						}) ();
						return (function () {
							var __accu0__ = self;
							return __call__ (__accu0__.movenext, __accu0__, myX, myY, occupied);
						}) ();
					}
				}
			}
			else {
				if (__t__ (__eq__ (__call__ (len, null, self.myPath), 1))) {
					(function () {
						var __accu0__ = self;
						return __call__ (__accu0__.log, __accu0__, 'NEW CASTLE!!!');
					}) ();
					(function () {
						var __accu0__ = self;
						return __call__ (__accu0__.signal, __accu0__, 1, 6);
					}) ();
				}
				return (function () {
					var __accu0__ = self;
					return __call__ (__accu0__.movenext, __accu0__, myX, myY, occupied);
				}) ();
			}
		}
	});},
	get fix_approximation () {return __get__ (this, function (self, x, y, approximation) {
		for (var newx = x; newx < __add__ (x, approximation); newx++) {
			for (var newy = y; newy < __add__ (y, approximation); newy++) {
				if (__t__ (__getitem__ (__getitem__ (self.map, newy), newx))) {
					return tuple ([newx, newy]);
				}
			}
		}
	});},
	get compress_coordinates () {return __get__ (this, function (self, coords, approx) {
		if (typeof approx == 'undefined' || (approx != null && approx.hasOwnProperty ("__kwargtrans__"))) {			var approx = 4;
		}		var signal = 0;
		var __iterable0__ = coords;
		__iterable0__ = __i__ (__iterable0__);
		for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
			var __left0__ = __getitem__ (__iterable0__, __index0__);
			var enemy_x = __left0__ [0];
			var enemy_y = __left0__ [1];
			var signal = __call__ (__iadd__, null, signal, __floordiv__ (enemy_x, approx));
			var signal = __call__ (__ilshift__, null, signal, __sub__ (6, __floordiv__ (approx, 2)));
			var signal = __call__ (__iadd__, null, signal, __floordiv__ (enemy_y, approx));
			var signal = __call__ (__ilshift__, null, signal, __sub__ (6, __floordiv__ (approx, 2)));
		}
		var signal = __call__ (__irshift__, null, signal, __sub__ (6, __floordiv__ (approx, 2)));
		return signal;
	});},
	get convert_compressed_signal () {return __get__ (this, function (self, signal, approx) {
		if (typeof approx == 'undefined' || (approx != null && approx.hasOwnProperty ("__kwargtrans__"))) {			var approx = 4;
		}		var coords = [];
		while (__t__ (__gt__ (signal, 0))) {
			var y = __mul__ (__mod__ (signal, __floordiv__ (64, approx)), approx);
			var signal = __call__ (__irshift__, null, signal, __sub__ (6, __floordiv__ (approx, 2)));
			var x = __mul__ (__mod__ (signal, __floordiv__ (64, approx)), approx);
			var signal = __call__ (__irshift__, null, signal, __sub__ (6, __floordiv__ (approx, 2)));
			(function () {
				var __accu0__ = coords;
				return __call__ (__accu0__.append, __accu0__, tuple ([x, y]));
			}) ();
		}
		if (__t__ (__eq__ (coords, []))) {
			return [tuple ([0, 0])];
		}
		return coords;
	});},
	get find_enemy_castles () {return __get__ (this, function (self) {
		var r = [];
		if (__t__ (__eq__ (self.symmetry, []))) {
			self.symmetry = (function () {
				var __accu0__ = self;
				return __call__ (__accu0__.find_symmetry, __accu0__);
			}) ();
		}
		(function () {
			var __accu0__ = self;
			return __call__ (__accu0__.log, __accu0__, __add__ ('SYMMETRY ', __call__ (str, null, self.symmetry)));
		}) ();
		var __iterable0__ = self.my_castle_locations;
		__iterable0__ = __i__ (__iterable0__);
		for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
			var castle = __getitem__ (__iterable0__, __index0__);
			var __left0__ = castle;
			var x = __left0__ [0];
			var y = __left0__ [1];
			(function () {
				var __accu0__ = self;
				return __call__ (__accu0__.log, __accu0__, __call__ (str, null, tuple ([x, y])));
			}) ();
			(function () {
				var __accu0__ = self;
				return __call__ (__accu0__.log, __accu0__, (function () {
					var __accu1__ = self;
					return __call__ (__accu1__.reflect, __accu1__, x, y, __getitem__ (self.symmetry, 1), __getitem__ (self.symmetry, 0));
				}) ());
			}) ();
			(function () {
				var __accu0__ = r;
				return __call__ (__accu0__.append, __accu0__, (function () {
					var __accu1__ = self;
					return __call__ (__accu1__.reflect, __accu1__, x, y, __getitem__ (self.symmetry, 1), __getitem__ (self.symmetry, 0));
				}) ());
			}) ();
		}
		return r;
	});},
	get find_symmetry () {return __get__ (this, function (self) {
		var r = [true, true];
		if (__t__ (__eq__ (self.found_karbonite, []))) {
			var __iterable0__ = __call__ (enumerate, null, self.karbonite_map);
			__iterable0__ = __i__ (__iterable0__);
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var __left0__ = __getitem__ (__iterable0__, __index0__);
				var y = __left0__ [0];
				var col = __left0__ [1];
				var __iterable1__ = __call__ (enumerate, null, col);
				__iterable1__ = __i__ (__iterable1__);
				for (var __index1__ = 0; __index1__ < len (__iterable1__); __index1__++) {
					var __left0__ = __getitem__ (__iterable1__, __index1__);
					var x = __left0__ [0];
					var item = __left0__ [1];
					if (__t__ (item)) {
						self.found_karbonite = __call__ (__iadd__, null, self.found_karbonite, [tuple ([x, y])]);
					}
				}
			}
		}
		var __iterable0__ = self.found_karbonite;
		__iterable0__ = __i__ (__iterable0__);
		for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
			var __left0__ = __getitem__ (__iterable0__, __index0__);
			var x = __left0__ [0];
			var y = __left0__ [1];
			var __left0__ = (function () {
				var __accu0__ = self;
				return __call__ (__accu0__.reflect, __accu0__, x, y, true);
			}) ();
			var hor_x = __left0__ [0];
			var hor_y = __left0__ [1];
			var __left0__ = (function () {
				var __accu0__ = self;
				return __call__ (__accu0__.reflect, __accu0__, x, y, false, true);
			}) ();
			var ver_x = __left0__ [0];
			var ver_y = __left0__ [1];
			if (__t__ (!__t__ ((__getitem__ (__getitem__ (self.karbonite_map, hor_y), hor_x))))) {
				__setitem__ (r, 1, false);
			}
			if (__t__ (!__t__ ((__getitem__ (__getitem__ (self.karbonite_map, ver_y), ver_x))))) {
				__setitem__ (r, 0, false);
			}
		}
		return r;
	});},
	get reflect () {return __get__ (this, function (self, x, y, x_axis, y_axis) {
		if (typeof x_axis == 'undefined' || (x_axis != null && x_axis.hasOwnProperty ("__kwargtrans__"))) {			var x_axis = false;
		}		if (typeof y_axis == 'undefined' || (y_axis != null && y_axis.hasOwnProperty ("__kwargtrans__"))) {			var y_axis = false;
		}		var mid_point = __sub__ (__call__ (len, null, self.map), 1);
		var __left0__ = tuple ([x, y]);
		var newx = __left0__ [0];
		var newy = __left0__ [1];
		if (__t__ (x_axis)) {
			var newx = __sub__ (mid_point, x);
		}
		if (__t__ (y_axis)) {
			var newy = __sub__ (mid_point, y);
		}
		return tuple ([newx, newy]);
	});},
	get if_visible_attack () {return __get__ (this, function (self, myX, myY) {
		var enemies = (function () {
			var __accu0__ = [];
			var __iterable0__ = (function () {
				var __accu1__ = self;
				return __call__ (__accu1__.get_visible_robots, __accu1__);
			}) ();
			__iterable0__ = __i__ (__iterable0__);
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var r = __getitem__ (__iterable0__, __index0__);
				if (__t__ (__ne__ (r.team, __getitem__ (self.me, 'team')))) {
					(function () {
						var __accu1__ = __accu0__;
						return __call__ (__accu1__.append, __accu1__, r);
					}) ();
				}
			}
			return __accu0__;
		}) ();
		var __left0__ = __getitem__ (__getitem__ (__getitem__ (SPECS, 'UNITS'), __getitem__ (self.me, 'unit')), 'ATTACK_RADIUS');
		var radius_min = __left0__ [0];
		var radius_max = __left0__ [1];
		var attackable_robots = (function () {
			var __accu0__ = [];
			var __iterable0__ = enemies;
			__iterable0__ = __i__ (__iterable0__);
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var r = __getitem__ (__iterable0__, __index0__);
				if (__t__ ((__le__ (radius_min, __add__ (__pow__ (__sub__ (myX, r.x), 2), __pow__ (__sub__ (myY, r.y), 2))) && __le__ (__add__ (__pow__ (__sub__ (myX, r.x), 2), __pow__ (__sub__ (myY, r.y), 2)), radius_max)))) {
					(function () {
						var __accu1__ = __accu0__;
						return __call__ (__accu1__.append, __accu1__, r);
					}) ();
				}
			}
			return __accu0__;
		}) ();
		var maxid = __call__ (max, null, (function () {
			var __accu0__ = [];
			var __iterable0__ = attackable_robots;
			__iterable0__ = __i__ (__iterable0__);
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var i = __getitem__ (__iterable0__, __index0__);
				(function () {
					var __accu1__ = __accu0__;
					return __call__ (__accu1__.append, __accu1__, i.id);
				}) ();
			}
			return __accu0__;
		}) ());
		var __iterable0__ = attackable_robots;
		__iterable0__ = __i__ (__iterable0__);
		for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
			var r = __getitem__ (__iterable0__, __index0__);
			if (__t__ (__eq__ (r.id, maxid))) {
				return (function () {
					var __accu0__ = self;
					return __call__ (__accu0__.attack, __accu0__, __sub__ (r.x, myX), __sub__ (r.y, myY));
				}) ();
			}
		}
		return false;
	});},
	get check_valid_square () {return __get__ (this, function (self, x, y, occupied) {
		if (__t__ (__t__ (__ge__ (x, __call__ (len, null, self.map))) || __t__ (__lt__ (x, 0)) || __t__ (__ge__ (y, __call__ (len, null, self.map))) || __lt__ (y, 0))) {
			return false;
		}
		if (__t__ (__ne__ (occupied, []))) {
			var __iterable0__ = occupied;
			__iterable0__ = __i__ (__iterable0__);
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var __left0__ = __getitem__ (__iterable0__, __index0__);
				var X = __left0__ [0];
				var Y = __left0__ [1];
				if (__t__ (__eq__ (tuple ([x, y]), tuple ([X, Y])))) {
					return false;
				}
			}
		}
		return __getitem__ (__getitem__ (self.map, y), x);
	});},
	get pathfindsteps () {return __get__ (this, function (self, x, y, targetx, targety, path, occupied) {
		var max_speed = __getitem__ (__getitem__ (__getitem__ (SPECS, 'UNITS'), __getitem__ (self.me, 'unit')), 'SPEED');
		if (__t__ (__eq__ (tuple ([x, y]), tuple ([targetx, targety])))) {
			return __add__ ([tuple ([x, y])], path);
		}
		if (__t__ (!__t__ (((function () {
			var __accu0__ = self;
			return __call__ (__accu0__.check_valid_square, __accu0__, x, y, occupied);
		}) ())))) {
			return false;
		}
		var __iterable0__ = path;
		__iterable0__ = __i__ (__iterable0__);
		for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
			var i = __getitem__ (__iterable0__, __index0__);
			if (__t__ (__eq__ (i, tuple ([x, y])))) {
				return false;
			}
		}
		if (__t__ (__gt__ (__call__ (len, null, path), 1))) {
			var __left0__ = __getitem__ (path, 1);
			var prevx = __left0__ [0];
			var prevy = __left0__ [1];
			if (__t__ (__le__ ((function () {
				var __accu0__ = self;
				return __call__ (__accu0__.heuristic, __accu0__, x, y, prevx, prevy);
			}) (), max_speed))) {
				return false;
			}
		}
		var path = __add__ ([tuple ([x, y])], path);
		var possible_moves = __getitem__ (self.ranges, __call__ (str, null, max_speed));
		var harray = [];
		var __iterable0__ = possible_moves;
		__iterable0__ = __i__ (__iterable0__);
		for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
			var moves = __getitem__ (__iterable0__, __index0__);
			var __left0__ = moves;
			var dx = __left0__ [0];
			var dy = __left0__ [1];
			var harray = __call__ (__iadd__, null, harray, [(function () {
				var __accu0__ = self;
				return __call__ (__accu0__.heuristic, __accu0__, __add__ (x, dx), __add__ (y, dy), targetx, targety);
			}) ()]);
		}
		var count = __call__ (len, null, harray);
		while (__t__ (__gt__ (count, 0))) {
			var minindex = (function () {
				var __accu0__ = harray;
				return __call__ (__accu0__.index, __accu0__, __call__ (min, null, harray));
			}) ();
			__setitem__ (harray, minindex, 6969696969);
			var __left0__ = __getitem__ (possible_moves, minindex);
			var dx = __left0__ [0];
			var dy = __left0__ [1];
			var ret = (function () {
				var __accu0__ = self;
				return __call__ (__accu0__.pathfindsteps, __accu0__, __add__ (x, dx), __add__ (y, dy), targetx, targety, path, occupied);
			}) ();
			if (__t__ (__ne__ (ret, false))) {
				return ret;
			}
			var count = __call__ (__isub__, null, count, 1);
		}
		return false;
	});},
	get heuristic () {return __get__ (this, function (self, x, y, targetx, targety) {
		return __add__ (__pow__ (__sub__ (x, targetx), 2), __pow__ (__sub__ (y, targety), 2));
	});},
	get movenext () {return __get__ (this, function (self, myX, myY, occupied) {
		if (__t__ (__eq__ (self.myPath, []))) {
			return false;
		}
		var __left0__ = tuple ([__sub__ (__getitem__ (__getitem__ (self.myPath, __neg__ (1)), 0), myX), __sub__ (__getitem__ (__getitem__ (self.myPath, __neg__ (1)), 1), myY)]);
		var dx = __left0__ [0];
		var dy = __left0__ [1];
		if (__t__ ((__eq__ (dy, dx) && __eq__ (dx, 0)))) {
			self.myPath = __getslice__ (self.myPath, 0, __neg__ (1), 1);
			if (__t__ (__eq__ (self.myPath, []))) {
				return false;
			}
		}
		var boolMap = (function () {
			var __accu0__ = [];
			for (var i = 0; i < __call__ (len, null, self.myPath); i++) {
				(function () {
					var __accu1__ = __accu0__;
					return __call__ (__accu1__.append, __accu1__, true);
				}) ();
			}
			return __accu0__;
		}) ();
		var __iterable0__ = occupied;
		__iterable0__ = __i__ (__iterable0__);
		for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
			var __left0__ = __getitem__ (__iterable0__, __index0__);
			var x = __left0__ [0];
			var y = __left0__ [1];
			var __iterable1__ = __call__ (enumerate, null, self.myPath);
			__iterable1__ = __i__ (__iterable1__);
			for (var __index1__ = 0; __index1__ < len (__iterable1__); __index1__++) {
				var __left0__ = __getitem__ (__iterable1__, __index1__);
				var index = __left0__ [0];
				var X = __left0__ [1][0];
				var Y = __left0__ [1][1];
				if (__t__ (__eq__ (tuple ([x, y]), tuple ([X, Y])))) {
					__setitem__ (boolMap, index, false);
				}
			}
		}
		if (__t__ (__getitem__ (boolMap, __neg__ (1)))) {
			return (function () {
				var __accu0__ = self;
				return __call__ (__accu0__.move, __accu0__, __sub__ (__getitem__ (__getitem__ (self.myPath, __neg__ (1)), 0), myX), __sub__ (__getitem__ (__getitem__ (self.myPath, __neg__ (1)), 1), myY));
			}) ();
		}
		if (__t__ (!__t__ ((__call__ (any, null, boolMap))))) {
			return false;
		}
		var newRoute = [__getitem__ (self.myPath, 0)];
		var __left0__ = tuple ([0, 0]);
		var start = __left0__ [0];
		var end = __left0__ [1];
		while (__t__ (__lt__ (end, __call__ (len, null, self.myPath)))) {
			if (__t__ (__t__ (__getitem__ (boolMap, end)) || __eq__ (end, __sub__ (__call__ (len, null, self.myPath), 1)))) {
				var __left0__ = __getitem__ (self.myPath, start);
				var targetx = __left0__ [0];
				var targety = __left0__ [1];
				var __left0__ = __getitem__ (self.myPath, end);
				var initx = __left0__ [0];
				var inity = __left0__ [1];
				if (__t__ (__eq__ (end, __sub__ (__call__ (len, null, self.myPath), 1)))) {
					if (__t__ (!__t__ ((__getitem__ (boolMap, end))))) {
						var __left0__ = tuple ([myX, myY]);
						var initx = __left0__ [0];
						var inity = __left0__ [1];
						var __left0__ = __getitem__ (self.myPath, start);
						var targetx = __left0__ [0];
						var targety = __left0__ [1];
					}
				}
				var route = (function () {
					var __accu0__ = self;
					return __call__ (__accu0__.pathfindsteps, __accu0__, initx, inity, targetx, targety, [], occupied);
				}) ();
				if (__t__ (__eq__ (__getitem__ (route, 0), __getitem__ (newRoute, __neg__ (1))))) {
					var route = __getslice__ (route, 1, null, 1);
				}
				(function () {
					var __accu0__ = newRoute;
					return __call__ (__accu0__.extend, __accu0__, route);
				}) ();
				var start = end;
			}
			var end = __call__ (__iadd__, null, end, 1);
		}
		if (__t__ (!__t__ ((__getitem__ (boolMap, __sub__ (end, 1)))))) {
			var newRoute = __getslice__ (newRoute, 0, __neg__ (1), 1);
		}
		if (__t__ (__ne__ (self.myPath, newRoute))) {
			self.myPath = newRoute;
			(function () {
				var __accu0__ = self;
				return __call__ (__accu0__.log, __accu0__, __add__ (__add__ (__add__ (__add__ (__add__ ('Rerouted ', __call__ (str, null, self.myPath)), ' '), myX), ', '), myY));
			}) ();
		}
		var __left0__ = tuple ([__sub__ (__getitem__ (__getitem__ (self.myPath, __neg__ (1)), 0), myX), __sub__ (__getitem__ (__getitem__ (self.myPath, __neg__ (1)), 1), myY)]);
		var dx = __left0__ [0];
		var dy = __left0__ [1];
		return (function () {
			var __accu0__ = self;
			return __call__ (__accu0__.move, __accu0__, dx, dy);
		}) ();
	});}
});
var __left0__ = tuple ([9, 7]);
MyRobot.a = __left0__ [0];
MyRobot.b = __left0__ [1];
var robot = new MyRobot();