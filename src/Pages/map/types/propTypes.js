import PropTypes from "prop-types";

export const MarkerPropTypes = {
  cid: PropTypes.string,
  type: PropTypes.string,
  position: PropTypes.arrayOf(PropTypes.number),
};

export const ModalPropTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export const MapControlsPropTypes = {
  theme: PropTypes.string,
  toggleTheme: PropTypes.func,
  activeSidePanel: PropTypes.string,
  setActiveSidePanel: PropTypes.func,
  filter: PropTypes.object,
  setFilter: PropTypes.func,
};
