// create menue when click on cluster
export function setupClusterClickHandler(mapInstance, getInteractionManager) {
  mapInstance.value.on('singleclick', (evt) => {
    const feature = mapInstance.value.forEachFeatureAtPixel(evt.pixel, (f) => f);
    if (!feature) return;

    const inner = feature.get('features') || [];
    if (!Array.isArray(inner) || inner.length <= 1) return;

    evt.preventDefault();
    evt.stopPropagation();

    const interactionManager = getInteractionManager();
    if (interactionManager) {
      interactionManager.clearMapInteractions();
    }

    const menu = createClusterMenu(evt, inner, mapInstance);
    document.body.appendChild(menu);

    const removeMenu = () => {
      if (menu && menu.parentNode) menu.parentNode.removeChild(menu);
      document.removeEventListener('click', removeMenu);
    };
    setTimeout(() => document.addEventListener('click', removeMenu), 0);
  });
}
//create cluster menu
function createClusterMenu(evt, features, mapInstance) {
  const menu = document.createElement('div');
  Object.assign(menu.style, {
    position: 'absolute',
    left: evt.originalEvent.pageX + 'px',
    top: evt.originalEvent.pageY + 'px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '8px',
    zIndex: '10000',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    maxHeight: '240px',
    overflowY: 'auto',
    minWidth: '160px',
    fontSize: '13px',
  });

  const title = document.createElement('div');
  title.innerText = `Areas (${features.length})`;
  title.style.fontWeight = '600';
  title.style.marginBottom = '6px';
  menu.appendChild(title);

  const list = document.createElement('ul');
  Object.assign(list.style, {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  });

  features.forEach((f, idx) => {
    const li = createClusterMenuItem(f, idx, mapInstance);
    list.appendChild(li);
  });

  menu.appendChild(list);
  return menu;
}

//create cluster menu item
function createClusterMenuItem(f, idx, mapInstance) {
  const li = document.createElement('li');
  const originalFeature = f.get('originalFeature') || f;
  const name = originalFeature.get('name') || `Area ${idx + 1}`;

  li.innerText = name;
  Object.assign(li.style, {
    padding: '6px 8px',
    cursor: 'pointer',
    borderRadius: '4px',
  });

  li.onmouseenter = () => { li.style.background = '#f1f1f1'; };
  li.onmouseleave = () => { li.style.background = 'transparent'; };

  li.onclick = (e) => {
    e.stopPropagation();
    zoomToFeature(originalFeature, mapInstance);

    //remove item in menu
    const menu = li.closest('div');
    if (menu) menu.remove();
  };

  return li;
}
//zoom to feature
function zoomToFeature(feature, mapInstance) {
  const geom = feature.getGeometry();
  if (!geom) return;

  const view = mapInstance.value.getView();
  if (geom.getType().toLowerCase() === 'point') {
    view.animate({
      center: geom.getCoordinates(),
      duration: 500,
      zoom: 16
    });
  } else {
    view.fit(geom.getExtent(), {
      duration: 500,
      maxZoom: 18
    });
  }
}