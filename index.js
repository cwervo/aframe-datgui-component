/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Dat.Gui VR component for A-Frame.
 */
AFRAME.registerComponent('datgui', {
    schema: {
        name: { type: "string" },
        properties: { type: "array" },
        position: { type: "vec3" },
        inheritPosition : { default : false }
    },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
    init: function () {
        var scene = this.el.sceneEl.object3D;
        var gui = dat.GUIVR.create(this.data.name);
        //console.log("pos:", this.el.object3D.position.clone());
        var guiPos = new THREE.Vector3(0, 0, 0);
        if (this.data.position) {
            ['x','y','z'].forEach(function (axis) {
                guiPos[axis] = this[axis];
            }, this.data.position);
        }
        if (this.data.inheritPosition) {
            ['x','y','z'].forEach(function (axis) {
                guiPos[axis] += this[axis];
            }, this.el.object3D.position);
        }
        gui.position.set(
            guiPos.x,
            guiPos.y,
            guiPos.z
        );

        //console.log("data:", this.data.properties);
        var thisObject = this.el.object3D;
        this.data.properties.forEach(function(prop) {
            prop = prop.split('.');
            console.log("len",prop.length);
            var min = 0;
            var max = 10;
            if (prop.length == 1) {
                gui.add(thisObject[prop[0]], min, max);
            } else {
                var propController = gui.add(thisObject[prop[0]], prop[1], min, max);
                propController.name(prop[0] + '.' + prop[1]);
            }
        });
        gui.name = this.data.name + "GUI";
        scene.add(gui);
    },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) { },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});
