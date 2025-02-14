import 'jest-extended';
import * as util from '../src/index';


describe('utilCleanTags', () => {
  it('handles empty tags object', () => {
    const t = {};
    const result = util.utilCleanTags(t);
    expect(result).toStrictEqual({});
  });

  it('discards empty keys', () => {
    const t = { '': 'bar' };
    const result = util.utilCleanTags(t);
    expect(result).toStrictEqual({});
  });

  it('discards undefined values', () => {
    const t = { 'foo': undefined };
    const result = util.utilCleanTags(t);
    expect(result).toStrictEqual({});
  });

  it('trims whitespace', () => {
    const t = {
      leading: '   value',
      trailing: 'value  ',
      both: '   value  '
    };
    const result = util.utilCleanTags(t);
    expect(result).toStrictEqual({
      leading: 'value',
      trailing: 'value',
      both: 'value'
    });
  });

  it('cleans some unprintable characters from websites and emails', () => {
    const t = {
      website: 'http://example\u200B.com',
      email: 'person@example\u200C.com'
    };
    const result = util.utilCleanTags(t);
    expect(result).toStrictEqual({
      website: 'http://example.com',
      email: 'person@example.com'
    });
  });

  it('trims semicolon delimited whitespace', () => {
    const t = {
      leading: '   value1;  value2',
      trailing: 'value1  ;value2  ',
      both: '   value1  ;  value2  '
    };
    const result = util.utilCleanTags(t);
    expect(result).toStrictEqual({
      leading: 'value1;value2',
      trailing: 'value1;value2',
      both: 'value1;value2'
    });
  });

  it('does not clean description, note, fixme', () => {
    const t = {
      'description': '   value',
      'note': 'value  ',
      'fixme': '   value  '
    };
    const result = util.utilCleanTags(t);
    expect(result).toStrictEqual(t);
  });

  it('uses semicolon-space delimiting for opening_hours, conditional: tags', () => {
    const t = {
      'opening_hours': ' Mo-Su 08:00-18:00    ;Apr 10-15 off;Jun 08:00-14:00  ;  Aug off; Dec 25 off ',
      'collection_times': '  Mo 10:00-12:00,12:30-15:00    ;Tu-Fr 08:00-12:00,12:30-15:00;Sa 08:00-12:00    ',
      'maxspeed:conditional': '    120 @ (06:00-20:00)   ;80 @ wet  ',
      'restriction:conditional': '  no_u_turn @ (Mo-Fr 09:00-10:00,15:00-16:00;SH off)  '
    };
    const result = util.utilCleanTags(t);
    expect(result).toStrictEqual({
      'opening_hours': 'Mo-Su 08:00-18:00; Apr 10-15 off; Jun 08:00-14:00; Aug off; Dec 25 off',
      'collection_times': 'Mo 10:00-12:00,12:30-15:00; Tu-Fr 08:00-12:00,12:30-15:00; Sa 08:00-12:00',
      'maxspeed:conditional': '120 @ (06:00-20:00); 80 @ wet',
      'restriction:conditional': 'no_u_turn @ (Mo-Fr 09:00-10:00,15:00-16:00; SH off)'
    });
  });

});



// describe('utilGetAllNodes', () => {
//   const iD = {};  // fix
//   it('gets all descendant nodes of a way', () => {
//     const a = iD.osmNode({ id: 'a' });
//     const b = iD.osmNode({ id: 'b' });
//     const w = iD.osmWay({ id: 'w', nodes: ['a','b','a'] });
//     const graph = iD.coreGraph([a, b, w]);
//     const result = util.utilGetAllNodes(['w'], graph);

//     expect(result).to.have.members([a, b]);
//     expect(result).toHaveLengthOf(2);
//   });

//   it('gets all descendant nodes of a relation', () => {
//     const a = iD.osmNode({ id: 'a' });
//     const b = iD.osmNode({ id: 'b' });
//     const c = iD.osmNode({ id: 'c' });
//     const w = iD.osmWay({ id: 'w', nodes: ['a','b','a'] });
//     const r = iD.osmRelation({ id: 'r', members: [{id: 'w'}, {id: 'c'}] });
//     const graph = iD.coreGraph([a, b, c, w, r]);
//     const result = util.utilGetAllNodes(['r'], graph);

//     expect(result).to.have.members([a, b, c]);
//     expect(result).toHaveLengthOf(3);
//   });

//   it('gets all descendant nodes of multiple ids', () => {
//     const a = iD.osmNode({ id: 'a' });
//     const b = iD.osmNode({ id: 'b' });
//     const c = iD.osmNode({ id: 'c' });
//     const d = iD.osmNode({ id: 'd' });
//     const e = iD.osmNode({ id: 'e' });
//     const w1 = iD.osmWay({ id: 'w1', nodes: ['a','b','a'] });
//     const w2 = iD.osmWay({ id: 'w2', nodes: ['c','b','a','c'] });
//     const r = iD.osmRelation({ id: 'r', members: [{id: 'w1'}, {id: 'd'}] });
//     const graph = iD.coreGraph([a, b, c, d, e, w1, w2, r]);
//     const result = util.utilGetAllNodes(['r', 'w2', 'e'], graph);

//     expect(result).to.have.members([a, b, c, d, e]);
//     expect(result).toHaveLengthOf(5);
//   });

//   it('handles recursive relations', () => {
//     const a = iD.osmNode({ id: 'a' });
//     const r1 = iD.osmRelation({ id: 'r1', members: [{id: 'r2'}] });
//     const r2 = iD.osmRelation({ id: 'r2', members: [{id: 'r1'}, {id: 'a'}] });
//     const graph = iD.coreGraph([a, r1, r2]);
//     const result = util.utilGetAllNodes(['r1'], graph);

//     expect(result).to.have.members([a]);
//     expect(result).toHaveLengthOf(1);
//   });
// });


describe('utilTagDiff', () => {
  const oldTags = { a: 'one', b: 'two', c: 'three' };
  const newTags = { a: 'one', b: 'three', d: 'four' };
  const diff = util.utilTagDiff(oldTags, newTags);
  expect(diff).toHaveLength(4);
  expect(diff[0]).toStrictEqual({
    type: '-', key: 'b', oldVal: 'two', newVal: 'three', display: '- b=two'        // delete-modify
  });
  expect(diff[1]).toStrictEqual({
    type: '+', key: 'b', oldVal: 'two', newVal: 'three', display: '+ b=three'      // insert-modify
  });
  expect(diff[2]).toStrictEqual({
    type: '-', key: 'c', oldVal: 'three', newVal: undefined, display: '- c=three'  // delete
  });
  expect(diff[3]).toStrictEqual({
    type: '+', key: 'd', oldVal: undefined, newVal: 'four', display: '+ d=four'    // insert
  });
});


describe('utilTagText', () => {
  expect(util.utilTagText({})).toEqual('');
  expect(util.utilTagText({tags:{foo:'bar'}})).toEqual('foo=bar');
  expect(util.utilTagText({tags:{foo:'bar',two:'three'}})).toEqual('foo=bar, two=three');
});
