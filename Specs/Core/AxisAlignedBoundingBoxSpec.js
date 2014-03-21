/*global defineSuite*/
defineSuite([
         'Core/AxisAlignedBoundingBox',
         'Core/Cartesian3',
         'Core/Cartesian4',
         'Core/Intersect'
     ], function(
         AxisAlignedBoundingBox,
         Cartesian3,
         Cartesian4,
         Intersect) {
    "use strict";
    /*global jasmine,describe,xdescribe,it,xit,expect,beforeEach,afterEach,beforeAll,afterAll,spyOn,runs,waits,waitsFor*/

    var positions = [
                     new Cartesian3(3, -1, -3),
                     new Cartesian3(2, -2, -2),
                     new Cartesian3(1, -3, -1),
                     new Cartesian3(0, 0, 0),
                     new Cartesian3(-1, 1, 1),
                     new Cartesian3(-2, 2, 2),
                     new Cartesian3(-3, 3, 3)
                 ];

    var positionsMinimum = new Cartesian3(-3, -3, -3);
    var positionsMaximum = new Cartesian3(3, 3, 3);
    var positionsCenter = new Cartesian3(0, 0, 0);

    it('constructor sets expected default values', function() {
        var box = new AxisAlignedBoundingBox();
        expect(box.minimum).toEqual(Cartesian3.ZERO);
        expect(box.maximum).toEqual(Cartesian3.ZERO);
        expect(box.center).toEqual(Cartesian3.ZERO);
    });

    it('constructor sets expected parameter values', function() {
        var minimum = new Cartesian3(1, 2, 3);
        var maximum = new Cartesian3(4, 5, 6);
        var center = new Cartesian3(2.5, 3.5, 4.5);
        var box = new AxisAlignedBoundingBox(minimum, maximum, center);
        expect(box.minimum).toEqual(minimum);
        expect(box.maximum).toEqual(maximum);
        expect(box.center).toEqual(center);
    });

    it('constructor computes center if not supplied', function() {
        var minimum = new Cartesian3(1, 2, 3);
        var maximum = new Cartesian3(4, 5, 6);
        var expectedCenter = new Cartesian3(2.5, 3.5, 4.5);
        var box = new AxisAlignedBoundingBox(minimum, maximum);
        expect(box.minimum).toEqual(minimum);
        expect(box.maximum).toEqual(maximum);
        expect(box.center).toEqual(expectedCenter);
    });

    it('fromPoints constructs empty box with undefined positions', function() {
        var box = AxisAlignedBoundingBox.fromPoints(undefined);
        expect(box.minimum).toEqual(Cartesian3.ZERO);
        expect(box.maximum).toEqual(Cartesian3.ZERO);
        expect(box.center).toEqual(Cartesian3.ZERO);
    });

    it('fromPoints constructs empty box with empty positions', function() {
        var box = AxisAlignedBoundingBox.fromPoints([]);
        expect(box.minimum).toEqual(Cartesian3.ZERO);
        expect(box.maximum).toEqual(Cartesian3.ZERO);
        expect(box.center).toEqual(Cartesian3.ZERO);
    });

    it('fromPoints computes the correct values', function() {
        var box = AxisAlignedBoundingBox.fromPoints(positions);
        expect(box.minimum).toEqual(positionsMinimum);
        expect(box.maximum).toEqual(positionsMaximum);
        expect(box.center).toEqual(positionsCenter);
    });

    it('clone without a result parameter', function() {
        var box = new AxisAlignedBoundingBox(Cartesian3.UNIT_Y, Cartesian3.UNIT_X);
        var result = AxisAlignedBoundingBox.clone(box);
        expect(box).toNotBe(result);
        expect(box).toEqual(result);
    });

    it('clone with a result parameter', function() {
        var box = new AxisAlignedBoundingBox(Cartesian3.UNIT_Y, Cartesian3.UNIT_X);
        var result = new AxisAlignedBoundingBox(Cartesian3.ZERO, Cartesian3.UNIT_Z);
        var returnedResult = AxisAlignedBoundingBox.clone(box, result);
        expect(result).toBe(returnedResult);
        expect(box).toNotBe(result);
        expect(box).toEqual(result);
    });

    it('equals works in all cases', function() {
        var box = new AxisAlignedBoundingBox(Cartesian3.UNIT_X, Cartesian3.UNIT_Y, Cartesian3.UNIT_Z);
        var bogie = new Cartesian3(2, 3, 4);
        expect(AxisAlignedBoundingBox.equals(box, new AxisAlignedBoundingBox(Cartesian3.UNIT_X, Cartesian3.UNIT_Y, Cartesian3.UNIT_Z))).toEqual(true);
        expect(AxisAlignedBoundingBox.equals(box, new AxisAlignedBoundingBox(bogie, Cartesian3.UNIT_Y, Cartesian3.UNIT_Y))).toEqual(false);
        expect(AxisAlignedBoundingBox.equals(box, new AxisAlignedBoundingBox(Cartesian3.UNIT_X, bogie, Cartesian3.UNIT_Z))).toEqual(false);
        expect(AxisAlignedBoundingBox.equals(box, new AxisAlignedBoundingBox(Cartesian3.UNIT_X, Cartesian3.UNIT_Y, bogie))).toEqual(false);
        expect(AxisAlignedBoundingBox.equals(box, undefined)).toEqual(false);
    });

    it('computes the bounding box for a single position', function() {
        var box = AxisAlignedBoundingBox.fromPoints([positions[0]]);
        expect(box.minimum).toEqual(positions[0]);
        expect(box.maximum).toEqual(positions[0]);
        expect(box.center).toEqual(positions[0]);
    });

    it('intersect works with box on the positive side of a plane', function() {
        var box = new AxisAlignedBoundingBox(Cartesian3.negate(Cartesian3.UNIT_X), Cartesian3.ZERO);
        var normal = Cartesian3.negate(Cartesian3.UNIT_X);
        var position = Cartesian3.UNIT_X;
        var plane = new Cartesian4(normal.x, normal.y, normal.z, -Cartesian3.dot(normal, position));
        expect(AxisAlignedBoundingBox.intersect(box, plane)).toEqual(Intersect.INSIDE);
    });

    it('intersect works with box on the negative side of a plane', function() {
        var box = new AxisAlignedBoundingBox(Cartesian3.negate(Cartesian3.UNIT_X), Cartesian3.ZERO);
        var normal = Cartesian3.UNIT_X;
        var position = Cartesian3.UNIT_X;
        var plane = new Cartesian4(normal.x, normal.y, normal.z, -Cartesian3.dot(normal, position));
        expect(AxisAlignedBoundingBox.intersect(box, plane)).toEqual(Intersect.OUTSIDE);
    });

    it('intersect works with box intersecting a plane', function() {
        var box = new AxisAlignedBoundingBox(Cartesian3.ZERO, Cartesian3.multiplyByScalar(Cartesian3.UNIT_X, 2.0));
        var normal = Cartesian3.UNIT_X;
        var position = Cartesian3.UNIT_X;
        var plane = new Cartesian4(normal.x, normal.y, normal.z, -Cartesian3.dot(normal, position));
        expect(AxisAlignedBoundingBox.intersect(box, plane)).toEqual(Intersect.INTERSECTING);
    });

    it('clone returns undefined with no parameter', function() {
        expect(AxisAlignedBoundingBox.clone()).toBeUndefined();
    });

    it('intersect throws without a box', function() {
        var plane = new Cartesian4();
        expect(function() {
            AxisAlignedBoundingBox.intersect(undefined, plane);
        }).toThrowDeveloperError();
    });

    it('intersect throws without a plane', function() {
        var box = new AxisAlignedBoundingBox();
        expect(function() {
            AxisAlignedBoundingBox.intersect(box, undefined);
        }).toThrowDeveloperError();
    });
});
